import React from 'react';

/**
 * Markdown — a tiny, dependency-free, XSS-safe markdown renderer for chat bubbles.
 *
 * It supports the small subset the assistant actually produces:
 *   - **bold**, __bold__, *italic*, _italic_, `inline code`
 *   - fenced ```code blocks```
 *   - # headings (rendered compact)
 *   - unordered (-, *, +) and ordered (1.) lists
 *   - [links](url) plus autolinked bare URLs and emails
 *
 * Everything is rendered as React elements (never dangerouslySetInnerHTML), so
 * arbitrary model output cannot inject HTML/scripts. URLs are sanitized to
 * http(s)/mailto only.
 */

// Only allow safe URL schemes; anything else becomes a non-navigable anchor.
function sanitizeUrl(url) {
  const u = (url || '').trim();
  if (/^(https?:|mailto:)/i.test(u)) return u;
  if (/^www\./i.test(u)) return `https://${u}`;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(u)) return `mailto:${u}`;
  return null;
}

// Wrap bare URLs and email addresses in the given plain text as links.
function autolink(text, keyBase) {
  const out = [];
  const re = /(https?:\/\/[^\s<]+[^\s<.,;:!?)\]}'"]|www\.[^\s<]+[^\s<.,;:!?)\]}'"]|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  let last = 0;
  let m;
  let i = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const token = m[0];
    const isEmail = token.includes('@') && !/^https?:\/\//i.test(token);
    const href = isEmail ? `mailto:${token}` : token.startsWith('http') ? token : `https://${token}`;
    out.push(
      <a
        key={`${keyBase}-al${i}`}
        href={href}
        className="md-link"
        {...(isEmail ? {} : { target: '_blank', rel: 'noreferrer noopener' })}
      >
        {token}
      </a>
    );
    last = m.index + token.length;
    i += 1;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

const INLINE_PATTERNS = [
  { type: 'code', re: /`([^`]+)`/ },
  { type: 'bold', re: /\*\*([^*]+?)\*\*/ },
  { type: 'bold', re: /__([^_]+?)__/ },
  { type: 'link', re: /\[([^\]]+)\]\(([^)\s]+)\)/ },
  { type: 'italic', re: /\*([^*\n]+?)\*/ },
  { type: 'italic', re: /_([^_\n]+?)_/ },
];

// Parse inline markdown into an array of React nodes.
function parseInline(text, keyBase) {
  if (!text) return [];
  const nodes = [];
  let remaining = text;
  let counter = 0;

  while (remaining) {
    let best = null;
    for (const p of INLINE_PATTERNS) {
      const match = p.re.exec(remaining);
      if (match && (best === null || match.index < best.match.index)) {
        best = { pattern: p, match };
      }
    }

    if (!best) {
      nodes.push(...autolink(remaining, `${keyBase}-${counter}`));
      break;
    }

    const { pattern, match } = best;
    if (match.index > 0) {
      nodes.push(...autolink(remaining.slice(0, match.index), `${keyBase}-${counter}`));
    }
    const key = `${keyBase}-${counter}x`;

    if (pattern.type === 'code') {
      nodes.push(<code key={key} className="md-code">{match[1]}</code>);
    } else if (pattern.type === 'bold') {
      nodes.push(<strong key={key}>{parseInline(match[1], key)}</strong>);
    } else if (pattern.type === 'italic') {
      nodes.push(<em key={key}>{parseInline(match[1], key)}</em>);
    } else if (pattern.type === 'link') {
      const href = sanitizeUrl(match[2]);
      nodes.push(
        href ? (
          <a key={key} href={href} className="md-link" target="_blank" rel="noreferrer noopener">
            {parseInline(match[1], key)}
          </a>
        ) : (
          <span key={key}>{parseInline(match[1], key)}</span>
        )
      );
    }

    counter += 1;
    remaining = remaining.slice(match.index + match[0].length);
  }

  return nodes;
}

// Group raw text into block-level structures (paragraphs, lists, code, headings).
function parseBlocks(text) {
  const lines = String(text).replace(/\r\n/g, '\n').split('\n');
  const blocks = [];
  let i = 0;

  const isUl = (l) => /^\s*[-*+]\s+/.test(l);
  const isOl = (l) => /^\s*\d+\.\s+/.test(l);
  const isFence = (l) => /^\s*```/.test(l);
  const isHeading = (l) => /^#{1,6}\s+/.test(l);

  while (i < lines.length) {
    const line = lines[i];

    if (isFence(line)) {
      const code = [];
      i += 1;
      while (i < lines.length && !isFence(lines[i])) {
        code.push(lines[i]);
        i += 1;
      }
      i += 1; // skip closing fence
      blocks.push({ type: 'code', content: code.join('\n') });
      continue;
    }

    const heading = /^#{1,6}\s+(.*)$/.exec(line);
    if (heading) {
      blocks.push({ type: 'heading', content: heading[1] });
      i += 1;
      continue;
    }

    if (isUl(line)) {
      const items = [];
      while (i < lines.length && isUl(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*+]\s+/, ''));
        i += 1;
      }
      blocks.push({ type: 'ul', items });
      continue;
    }

    if (isOl(line)) {
      const items = [];
      while (i < lines.length && isOl(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ''));
        i += 1;
      }
      blocks.push({ type: 'ol', items });
      continue;
    }

    if (line.trim() === '') {
      i += 1;
      continue;
    }

    const para = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !isFence(lines[i]) &&
      !isHeading(lines[i]) &&
      !isUl(lines[i]) &&
      !isOl(lines[i])
    ) {
      para.push(lines[i]);
      i += 1;
    }
    blocks.push({ type: 'p', lines: para });
  }

  return blocks;
}

function renderBlocks(text) {
  return parseBlocks(text).map((block, idx) => {
    if (block.type === 'code') {
      return (
        <pre key={idx} className="md-pre">
          <code>{block.content}</code>
        </pre>
      );
    }
    if (block.type === 'heading') {
      return (
        <p key={idx} className="md-h">
          {parseInline(block.content, `h${idx}`)}
        </p>
      );
    }
    if (block.type === 'ul') {
      return (
        <ul key={idx} className="md-ul">
          {block.items.map((it, j) => (
            <li key={j}>{parseInline(it, `ul${idx}-${j}`)}</li>
          ))}
        </ul>
      );
    }
    if (block.type === 'ol') {
      return (
        <ol key={idx} className="md-ol">
          {block.items.map((it, j) => (
            <li key={j}>{parseInline(it, `ol${idx}-${j}`)}</li>
          ))}
        </ol>
      );
    }
    // paragraph: preserve single line breaks with <br/>
    const nodes = [];
    block.lines.forEach((ln, j) => {
      if (j > 0) nodes.push(<br key={`br${idx}-${j}`} />);
      nodes.push(...parseInline(ln, `p${idx}-${j}`));
    });
    return (
      <p key={idx} className="md-p">
        {nodes}
      </p>
    );
  });
}

export default function Markdown({ text }) {
  return <div className="message-md">{renderBlocks(text ?? '')}</div>;
}
