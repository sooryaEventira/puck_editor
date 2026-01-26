export type SearchIndexEntry<T> = {
  item: T
  text: string
}

export type IndexedSearchOptions = {
  fuzzy?: boolean
}

export function normalizeSearchText(input: unknown): string {
  return String(input ?? '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

export function buildSearchIndex<T>(items: T[], getText: (item: T) => unknown): SearchIndexEntry<T>[] {
  return items.map((item) => ({
    item,
    text: normalizeSearchText(getText(item))
  }))
}

const isSubsequence = (needle: string, haystack: string) => {
  if (!needle) return true
  let i = 0
  for (let j = 0; j < haystack.length && i < needle.length; j += 1) {
    if (haystack[j] === needle[i]) i += 1
  }
  return i === needle.length
}

const fuzzyTokenMatch = (token: string, haystack: string) => {
  if (!token) return true
  if (haystack.includes(token)) return true
  // Lightweight fuzzy: subsequence match (e.g. "jhn" matches "john")
  return isSubsequence(token, haystack)
}

export function searchIndex<T>(
  index: SearchIndexEntry<T>[],
  query: string,
  options: IndexedSearchOptions = {}
): T[] {
  const q = normalizeSearchText(query)
  if (!q) return index.map((e) => e.item)

  const tokens = q.split(' ').filter(Boolean)
  const fuzzy = Boolean(options.fuzzy)

  return index
    .filter((entry) =>
      tokens.every((t) => (fuzzy ? fuzzyTokenMatch(t, entry.text) : entry.text.includes(t)))
    )
    .map((e) => e.item)
}

