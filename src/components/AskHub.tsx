import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Link, useLocation } from 'react-router-dom';
import { findPage, pagePath } from '../content/hub';
import { askHub, AskHubError, type AskTurn } from '../lib/askHub';

/*
 * "Ask the hub": a slide-over panel where people ask questions in plain
 * English and get short answers built only from hub pages, with links to
 * the pages each answer came from.
 */

interface AskHubContextValue {
  open: (question?: string) => void;
}

const AskHubContext = createContext<AskHubContextValue>({ open: () => {} });

export function useAskHub() {
  return useContext(AskHubContext);
}

const suggestions = [
  'How many Whole Potential Days do I get?',
  'How far ahead do I need to book leave?',
  'When’s the next public holiday?',
  'What happens on my first day?',
];

interface Message extends AskTurn {
  state?: 'thinking' | 'streaming' | 'error';
}

export function AskHubProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initial, setInitial] = useState('');
  const opener = useRef<HTMLElement | null>(null);

  const open = useCallback((question = '') => {
    opener.current = document.activeElement as HTMLElement | null;
    setInitial(question);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    opener.current?.focus();
  }, []);

  const value = useMemo(() => ({ open }), [open]);

  return (
    <AskHubContext.Provider value={value}>
      {children}
      {isOpen && <AskHubPanel initialQuestion={initial} onClose={close} />}
    </AskHubContext.Provider>
  );
}

export function AskHubButton({ className }: { className?: string }) {
  const { open } = useAskHub();
  return (
    <button type="button" className={['ask-button', className].filter(Boolean).join(' ')} onClick={() => open()}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 5h16v11H9l-5 4z" />
        <path d="M8.5 10.5h7" />
      </svg>
      <span>Ask the hub</span>
    </button>
  );
}

function AskHubPanel({ initialQuestion, onClose }: { initialQuestion: string; onClose: () => void }) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const controller = useRef<AbortController | null>(null);
  const [draft, setDraft] = useState(initialQuestion);
  const [messages, setMessages] = useState<Message[]>([]);
  const busy = messages.some((m) => m.state === 'thinking' || m.state === 'streaming');
  const location = useLocation();
  const firstPath = useRef(location.pathname);

  // Close when a source link takes the reader to another page.
  useEffect(() => {
    if (location.pathname !== firstPath.current) onClose();
  }, [location.pathname, onClose]);

  useEffect(() => {
    inputRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // Escape closes the panel wherever focus has ended up.
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onEscape);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onEscape);
      controller.current?.abort();
    };
  }, [onClose]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [messages]);

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'Tab' || !panelRef.current) return;
    const focusable = [
      ...panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), textarea, [tabindex="0"]'),
    ];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  async function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed || busy) return;
    const history: AskTurn[] = messages
      .filter((m) => m.state !== 'error' && m.content.trim())
      .map(({ role, content }) => ({ role, content }));
    setDraft('');
    inputRef.current?.focus();
    setMessages((current) => [
      ...current,
      { role: 'user', content: trimmed },
      { role: 'assistant', content: '', state: 'thinking' },
    ]);

    const ctl = new AbortController();
    controller.current = ctl;
    const update = (patch: Partial<Message>) =>
      setMessages((current) => {
        const next = [...current];
        next[next.length - 1] = { ...next[next.length - 1], ...patch };
        return next;
      });

    try {
      const text = await askHub({
        question: trimmed,
        history,
        signal: ctl.signal,
        onText: (partial) => update({ content: partial, state: 'streaming' }),
      });
      update({ content: text, state: undefined });
    } catch (error) {
      if (ctl.signal.aborted) {
        update({ state: undefined });
        return;
      }
      const message = error instanceof AskHubError ? error.message : 'Something went wrong. Try asking again.';
      const partial = error instanceof AskHubError ? error.partial : '';
      update({ content: partial ? `${partial}\n\n${message}` : message, state: 'error' });
    } finally {
      if (controller.current === ctl) controller.current = null;
    }
  }

  return (
    <div className="ask-layer" onKeyDown={onKeyDown}>
      <div className="ask-scrim" onClick={onClose} aria-hidden="true" />
      <div ref={panelRef} className="ask-panel" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <header className="ask-panel__head">
          <div>
            <p className="tool__label">People hub</p>
            <h2 id={titleId} className="ask-panel__title">
              Ask the hub
            </h2>
          </div>
          <button type="button" className="ask-panel__close" onClick={onClose} aria-label="Close Ask the hub">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </header>

        <div className="ask-panel__body" aria-live="polite">
          {messages.length === 0 ? (
            <div className="ask-panel__intro">
              <p>
                Ask anything about leave, pay, perks or how we work. Answers come from hub pages, with links so you
                can check the detail.
              </p>
              <p className="ask-panel__suggest-label">Try one of these</p>
              <ul className="ask-panel__suggestions">
                {suggestions.map((s) => (
                  <li key={s}>
                    <button type="button" className="hub-chip" onClick={() => void ask(s)}>
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <ol className="ask-thread">
              {messages.map((m, i) => (
                <li key={i} className={`ask-turn ask-turn--${m.role}${m.state === 'error' ? ' is-error' : ''}`}>
                  {m.role === 'user' ? (
                    <p className="ask-turn__question">{m.content}</p>
                  ) : m.state === 'thinking' ? (
                    <p className="ask-turn__thinking">
                      <span className="ask-dots" aria-hidden="true">
                        <span />
                        <span />
                        <span />
                      </span>
                      Looking through the hub
                    </p>
                  ) : (
                    <AnswerText text={m.content} />
                  )}
                </li>
              ))}
            </ol>
          )}
          <div ref={endRef} />
        </div>

        <form
          className="ask-panel__form"
          onSubmit={(e) => {
            e.preventDefault();
            void ask(draft);
          }}
        >
          <label htmlFor="ask-hub-input" className="visually-hidden">
            Your question
          </label>
          <textarea
            id="ask-hub-input"
            ref={inputRef}
            rows={2}
            maxLength={1000}
            placeholder="Ask a question"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                void ask(draft);
              }
            }}
          />
          {busy ? (
            <button type="button" className="hd-btn hd-btn-secondary hd-btn-sm" onClick={() => controller.current?.abort()}>
              Stop
            </button>
          ) : (
            <button type="submit" className="hd-btn hd-btn-primary hd-btn-sm" disabled={!draft.trim()}>
              Ask
            </button>
          )}
        </form>
        <p className="ask-panel__fineprint">
          Answers can be wrong, so check the linked page. For anything personal, like your leave balance, look in HiBob
          or ask People and Culture.
        </p>
      </div>
    </div>
  );
}

/* Answers use a small slice of Markdown: paragraphs, "- " bullets, **bold** and [[topic/page]] sources. */

function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[\[[^\]]+\]\])/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
        if (part.startsWith('[[') && part.endsWith(']]')) {
          const [topic, page] = part.slice(2, -2).trim().split('/');
          const match = findPage(topic, page);
          if (!match) return null;
          return (
            <Link key={i} to={pagePath(topic, page)} className="ask-source">
              {match.page.title}
            </Link>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

export function AnswerText({ text }: { text: string }) {
  // Group consecutive bullet lines into lists; everything else becomes paragraphs.
  const blocks: { type: 'p' | 'ul'; lines: string[] }[] = [];
  for (const raw of text.trim().split('\n')) {
    const line = raw.trim();
    if (!line) {
      blocks.push({ type: 'p', lines: [] });
      continue;
    }
    const bullet = /^[-*]\s+/.test(line);
    const type = bullet ? 'ul' : 'p';
    const last = blocks[blocks.length - 1];
    const content = bullet ? line.replace(/^[-*]\s+/, '') : line.replace(/^#+\s*/, '');
    if (last && last.type === type && (type === 'ul' || last.lines.length > 0)) last.lines.push(content);
    else blocks.push({ type, lines: [content] });
  }

  return (
    <div className="ask-answer">
      {blocks
        .filter((b) => b.lines.length > 0)
        .map((block, i) =>
          block.type === 'ul' ? (
            <ul key={i}>
              {block.lines.map((line, j) => (
                <li key={j}>
                  <Inline text={line} />
                </li>
              ))}
            </ul>
          ) : (
            <p key={i}>
              <Inline text={block.lines.join(' ')} />
            </p>
          ),
        )}
    </div>
  );
}
