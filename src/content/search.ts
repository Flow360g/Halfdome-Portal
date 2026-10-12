import pageText from '../generated/search-text.json';
import { topics, type HubPage, type HubTopic } from './hub';

const bodyText = pageText as Record<string, string>;

export interface SearchResult {
  topic: HubTopic;
  page: HubPage;
  score: number;
}

function normalise(text: string) {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9:&' ]+/g, ' ')
    .trim();
}

function tokens(query: string) {
  return normalise(query).split(/\s+/).filter(Boolean);
}

const hasWordStarting = (text: string, word: string) => text.split(' ').some((w) => w.startsWith(word));

/**
 * Scores one page against the query. Every word in the query has to start a
 * word somewhere (title, keywords or topic); title hits count most.
 */
function scorePage(topic: HubTopic, page: HubPage, words: string[], phrase: string) {
  const title = normalise(page.title);
  const keywords = (page.keywords ?? []).map(normalise);
  const topicTitle = normalise(topic.title);
  const body = bodyText[`${topic.slug}/${page.slug}`] ?? '';
  let score = 0;

  for (const word of words) {
    const keywordHits = keywords.filter((k) => hasWordStarting(k, word)).length;
    if (hasWordStarting(title, word)) score += 6;
    else if (keywordHits > 0) score += 3;
    else if (hasWordStarting(topicTitle, word)) score += 1;
    else if (word.length > 2 && (body.includes(` ${word}`) || body.startsWith(word))) score += 1;
    else return 0;
    // Pages whose keywords keep coming back to the word are usually the main page for it.
    score += Math.min(keywordHits, 3);
  }

  if (title.startsWith(phrase)) score += 6;
  else if (title.includes(phrase)) score += 3;
  if (keywords.some((k) => k.startsWith(phrase))) score += 3;
  return score;
}

export function searchPages(query: string): SearchResult[] {
  const words = tokens(query);
  if (words.length === 0) return [];
  const phrase = words.join(' ');
  const results: SearchResult[] = [];

  for (const topic of topics) {
    for (const page of topic.pages) {
      const score = scorePage(topic, page, words, phrase);
      if (score > 0) results.push({ topic, page, score });
    }
  }

  return results.sort(
    (a, b) => b.score - a.score || a.page.title.length - b.page.title.length || a.page.title.localeCompare(b.page.title),
  );
}
