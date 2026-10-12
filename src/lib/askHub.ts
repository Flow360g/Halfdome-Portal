import { todayInMelbourne } from './dates';

/*
 * Ask the hub, from the page's side. Two ways to reach a model:
 * - the deployed hub calls the Supabase function `ask-hub` (OpenRouter behind it);
 * - the single-file preview, which can't reach Supabase, asks Claude through
 *   the artifact viewer's `sample` capability with the same instructions and content.
 * Either way the answer streams back through `onText`.
 */

export interface AskTurn {
  role: 'user' | 'assistant';
  content: string;
}

export class AskHubError extends Error {
  constructor(
    message: string,
    readonly partial = '',
  ) {
    super(message);
  }
}

interface AskOptions {
  question: string;
  history: AskTurn[];
  onText: (text: string) => void;
  signal: AbortSignal;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const isPreview = import.meta.env.MODE === 'artifact';

/** Whether this build has any way to answer questions. */
export const askHubConfigured = Boolean((supabaseUrl && anonKey) || isPreview);

export async function askHub(options: AskOptions): Promise<string> {
  if (isPreview) return askInPreview(options);
  if (supabaseUrl && anonKey) return askSupabase(options);
  throw new AskHubError('Ask the hub isn’t connected in this version of the hub yet.');
}

async function askSupabase({ question, history, onText, signal }: AskOptions): Promise<string> {
  let response: Response;
  try {
    response = await fetch(`${supabaseUrl}/functions/v1/ask-hub`, {
      method: 'POST',
      headers: {
        apikey: anonKey!,
        Authorization: `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question, history }),
      signal,
    });
  } catch (error) {
    if (signal.aborted) throw error;
    throw new AskHubError('Couldn’t reach Ask the hub. Check your connection and try again.');
  }

  if (!response.ok || !response.body) {
    const detail = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new AskHubError(detail?.error ?? 'Ask the hub is unavailable right now. Try again soon.');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let text = '';

  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue; // comments like ": OPENROUTER PROCESSING"
      const data = line.slice(6).trim();
      if (data === '[DONE]') continue;
      try {
        const event = JSON.parse(data) as {
          choices?: { delta?: { content?: string } }[];
          error?: { message?: string };
        };
        if (event.error) throw new AskHubError('The answer stopped part-way. Try asking again.', text);
        const delta = event.choices?.[0]?.delta?.content;
        if (delta) {
          text += delta;
          onText(text);
        }
      } catch (error) {
        if (error instanceof AskHubError) throw error;
        // Ignore a malformed line and keep reading.
      }
    }
  }

  if (!text.trim()) throw new AskHubError('No answer came back. Try asking in a different way.');
  return text;
}

interface SampleError {
  code: string;
  text?: string;
}

type SampleFn = (
  input: AskTurn[],
  options: {
    onText: (update: { text: string }) => void;
    signal: AbortSignal;
    cache: false;
    modelTier: 'quick' | 'default';
  },
) => Promise<{ text: string }>;

declare global {
  interface Window {
    claude?: { use: (name: string) => Promise<unknown> };
  }
}

async function askInPreview({ question, history, onText, signal }: AskOptions): Promise<string> {
  const sample = (await window.claude?.use('sample').catch(() => null)) as SampleFn | null | undefined;
  if (!sample) {
    throw new AskHubError('Ask the hub works when this preview is opened in Claude. Try opening the link there.');
  }

  const { default: hub } = await import('../generated/hub-content.json');
  const instructions = hub.instructions.replace('{today}', todayInMelbourne());
  const brief: AskTurn = {
    role: 'user',
    content: `${instructions}\n\n# Hub content\n\n${hub.content}\n\n(Acknowledge these instructions silently and answer the questions that follow.)`,
  };

  try {
    const result = await sample([brief, ...history, { role: 'user', content: question }], {
      onText: ({ text }) => onText(text),
      signal,
      cache: false,
      modelTier: 'quick',
    });
    return result.text;
  } catch (error) {
    const { code, text } = error as SampleError;
    if (code === 'cancelled') throw error;
    const messages: Record<string, string> = {
      not_granted: 'Ask the hub needs your OK to use Claude. Reload the page to be asked again.',
      rate_limited: 'Lots of questions at once. Try again in a minute.',
      sampling_disabled: 'Claude isn’t available on this account.',
    };
    throw new AskHubError(messages[code] ?? 'Something went wrong. Try asking again.', text ?? '');
  }
}
