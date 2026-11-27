export type MatchingContent = {
  concepts: { id: string; label: string }[];
  definitions: { id: string; label: string }[];
  pairs: Record<string, string>;
  hint: string;
  errorLimit: number;
};

export type MatchLinks = Record<string, string>;

export function linkDefinition(links: MatchLinks, conceptId: string, definitionId: string) {
  const next = { ...links };
  const previous = Object.keys(next).find((id) => next[id] === definitionId);
  if (previous) delete next[previous];
  next[conceptId] = definitionId;
  return next;
}

export function evaluateLinks(content: MatchingContent, links: MatchLinks, errors: number) {
  const correctLinks: MatchLinks = {};
  for (const [conceptId, definitionId] of Object.entries(links)) {
    if (content.pairs[conceptId] === definitionId) correctLinks[conceptId] = definitionId;
  }
  const missed = Object.keys(links).length - Object.keys(correctLinks).length;
  const newErrors = errors + missed;
  const outcome =
    missed === 0 && Object.keys(correctLinks).length === content.concepts.length
      ? 'passed'
      : newErrors >= content.errorLimit
        ? 'failed'
        : null;
  return { correctLinks, missed, newErrors, outcome } as const;
}
