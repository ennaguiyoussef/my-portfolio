import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMessageSquare, 
  FiX, 
  FiAlertCircle, 
  FiZap, 
  FiCheck,
  FiCornerDownLeft
} from 'react-icons/fi';
import { API_URL } from '../api';
import Markdown from './Markdown';
import './ChatWidget.css';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 0,
      role: 'assistant',
      content: "Hello! 👋 I'm Youssef's AI assistant. Ask me anything about his projects, background in Data & Agentic AI, or technical skills!",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingId, setStreamingId] = useState(null);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const currentInput = inputValue.trim();
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: currentInput,
      timestamp: new Date(),
    };

    const history = messages.map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setStreamingId(null);
    setError(null);

    const assistantId = Date.now() + 1;
    let accumulated = '';

    const upsertAssistant = (content) => {
      setMessages((prev) => {
        if (!prev.some((m) => m.id === assistantId)) {
          return [...prev, { id: assistantId, role: 'assistant', content, timestamp: new Date() }];
        }
        return prev.map((m) => (m.id === assistantId ? { ...m, content } : m));
      });
    };

    try {
      const response = await fetch(`${API_URL}/api/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput, history }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`Stream unavailable: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let streamError = null;
      let started = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const events = buffer.split('\n\n');
        buffer = events.pop() ?? '';

        for (const evt of events) {
          const dataLine = evt.split('\n').find((l) => l.startsWith('data:'));
          if (!dataLine) continue;
          const payload = dataLine.slice(5).trim();
          if (payload === '' || payload === '[DONE]') continue;

          let obj;
          try {
            obj = JSON.parse(payload);
          } catch {
            continue;
          }

          if (obj.delta) {
            accumulated += obj.delta;
            upsertAssistant(accumulated);
            if (!started) {
              started = true;
              setStreamingId(assistantId);
            }
          } else if (obj.error) {
            streamError = new Error(obj.error);
          }
        }
      }

      if (accumulated) return;
      throw streamError || new Error('Empty response received.');
    } catch (streamErr) {
      if (accumulated) {
        console.error('Stream interrupted:', streamErr);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: currentInput, history }),
        });

        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        const data = await response.json();
        upsertAssistant(data.response || data.message || 'Response received.');
      } catch (err) {
        console.error('Chat error:', err);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 2,
            role: 'assistant',
            content: "Sorry, I'm experiencing a temporary connection issue. Feel free to contact Youssef directly via email or LinkedIn!",
            timestamp: new Date(),
            isError: true,
          },
        ]);
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
      setStreamingId(null);
    }
  };

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) setError(null);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        className={`chat-toggle ${isOpen ? 'active' : ''}`}
        onClick={toggleChat}
        aria-label={isOpen ? 'Close chat' : 'Open AI chat'}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
      >
        <div className="toggle-glow" />
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <FiX size={22} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="toggle-icon-wrap"
            >
              <FiMessageSquare size={22} />
              <span className="toggle-badge-dot" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="chat-window"
            className="chat-window"
            initial={{ opacity: 0, scale: 0.9, y: 25, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 25 }}
            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
          >
            {/* Header */}
            <header className="chat-header">
              <div className="chat-header-left">
                <div className="chat-avatar-glow-wrap">
                  <div className="chat-avatar">
                    <FiZap size={18} />
                  </div>
                  <span className="status-indicator-dot" />
                </div>
                <div className="chat-header-info">
                  <div className="chat-title-row">
                    <h3 className="chat-title">Youssef AI</h3>
                    <span className="ai-chip">Agent</span>
                  </div>
                  <p className="chat-subtitle">Direct Knowledge Assistant</p>
                </div>
              </div>
              <button className="chat-close-btn" onClick={toggleChat} aria-label="Close conversation">
                <FiX size={18} />
              </button>
            </header>

            {/* Message Feed */}
            <div className="chat-messages" role="log" aria-live="polite">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`chat-row ${message.role} ${message.isError ? 'is-error' : ''}`}
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="chat-bubble-container">
                    <div className="chat-bubble">
                      {message.role === 'assistant' && !message.isError ? (
                        <div className="bubble-text md-rendered">
                          <Markdown text={message.content} />
                          {message.id === streamingId && <span className="streaming-cursor" />}
                        </div>
                      ) : (
                        <p className="bubble-text">{message.content}</p>
                      )}
                    </div>
                    <div className="bubble-meta">
                      <span className="meta-time">{formatTime(message.timestamp)}</span>
                      {message.role === 'assistant' && !message.isError && (
                        <FiCheck className="meta-check" size={11} aria-hidden="true" />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {isLoading && streamingId === null && (
                <motion.div
                  className="chat-row assistant"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  aria-label="Assistant is typing"
                >
                  <div className="chat-bubble typing-bubble">
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Error Notification */}
            {error && (
              <div className="chat-banner-warning" role="alert">
                <FiAlertCircle size={14} />
                <span>Service temporarily offline</span>
              </div>
            )}

            {/* Action Bar & Input */}
            <form className="chat-footer-form" onSubmit={handleSendMessage}>
              <div className="chat-input-pill">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={isLoading ? "Generating answer..." : "Ask me anything..."}
                  disabled={isLoading}
                  aria-label="Your message"
                  className="chat-native-input"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="chat-submit-button"
                  aria-label="Send message"
                >
                  {isLoading ? (
                    <div className="loading-spinner-xs" />
                  ) : (
                    <FiCornerDownLeft size={16} />
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}