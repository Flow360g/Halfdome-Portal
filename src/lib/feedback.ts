/*
 * "Was this helpful?" responses. In the deployed hub they go to the Supabase
 * table page_feedback, which anyone can add to but only People and Culture
 * can read. Without Supabase settings (local dev, the single-file preview)
 * they're kept in this browser so the flow still works end to end.
 */

export interface FeedbackEntry {
  page: string;
  helpful: boolean;
  comment?: string;
}

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export async function sendFeedback(entry: FeedbackEntry): Promise<void> {
  const body = { page: entry.page, helpful: entry.helpful, comment: entry.comment?.trim().slice(0, 2000) || null };

  if (url && anonKey) {
    const response = await fetch(`${url}/rest/v1/page_feedback`, {
      method: 'POST',
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`Feedback was not saved (${response.status})`);
    return;
  }

  try {
    const saved = JSON.parse(window.localStorage.getItem('hub:feedback') ?? '[]') as unknown[];
    saved.push({ ...body, created_at: new Date().toISOString() });
    window.localStorage.setItem('hub:feedback', JSON.stringify(saved.slice(-50)));
  } catch {
    // Nowhere to keep it; the thank-you still shows.
  }
}
