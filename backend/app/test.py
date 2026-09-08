import os
import requests
from dotenv import load_dotenv
from langchain_nvidia_ai_endpoints import ChatNVIDIA
from langchain_core.tools import tool

load_dotenv()

api_key = os.getenv("NVIDIA_API_KEY")
if not api_key:
    raise ValueError("NVIDIA_API_KEY is not set in environment variables.")

# 1. Fetch live models from NVIDIA NIM catalog
headers = {
    "Authorization": f"Bearer {api_key}",
    "Accept": "application/json"
}

print("Fetching active models from NVIDIA NIM catalog...")
response = requests.get("https://integrate.api.nvidia.com/v1/models", headers=headers)

if response.status_code != 200:
    print(f"Failed to fetch models: {response.status_code} - {response.text}")
    exit(1)

data = response.json()
all_models = [m["id"] for m in data.get("data", [])]

# Filter candidate chat models (instruct / chat / nemotron / llama / mistral / qwen)
chat_candidates = [
    m for m in all_models
    if any(k in m.lower() for k in ["instruct", "chat", "nemotron", "llama", "mistral", "qwen", "deepseek"])
    and "embed" not in m.lower()
    and "rerank" not in m.lower()
    and "guard" not in m.lower()
]

print(f"Found {len(chat_candidates)} potential chat models.\n")

# 2. Define a dummy tool to test tool-calling support
@tool
def get_weather(city: str) -> str:
    """Get current weather for a given city."""
    return f"Weather in {city} is sunny, 22°C."

# 3. Probe each model for basic inference & tool-calling
print(f"{'Model ID':<50} | {'Status':<10} | {'Tool Calling'}")
print("-" * 80)

working_tool_models = []

for model_id in chat_candidates:
    try:
        llm = ChatNVIDIA(
            model=model_id,
            nvidia_api_key=api_key,
            temperature=0.1,
            max_tokens=64
        )
        
        # Test basic invocation
        test_resp = llm.invoke("Hi")
        status = "LIVE"
        
        # Test tool calling capability
        tool_status = "NO"
        try:
            llm_with_tools = llm.bind_tools([get_weather])
            tool_resp = llm_with_tools.invoke("What's the weather in Casablanca?")
            if hasattr(tool_resp, "tool_calls") and tool_resp.tool_calls:
                tool_status = "YES"
                working_tool_models.append(model_id)
            else:
                tool_status = "BIND_OK (No Call)"
        except Exception:
            tool_status = "UNSUPPORTED"

        print(f"{model_id:<50} | {status:<10} | {tool_status}")

    except Exception as e:
        err_msg = str(e)
        if "410" in err_msg:
            status = "EOL (410)"
        elif "404" in err_msg:
            status = "404"
        elif "401" in err_msg:
            status = "AUTH_ERR"
        else:
            status = "FAILED"
        print(f"{model_id:<50} | {status:<10} | N/A")

print("\n" + "=" * 80)
print(f"Verified live models with confirmed tool calling support ({len(working_tool_models)}):")
for m in working_tool_models:
    print(f" - {m}")