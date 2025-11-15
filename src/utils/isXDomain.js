export function isXDomain(url) {
  if (!url) return false;
  return /^https:\/\/(x\.com|twitter\.com)\//.test(url);
}
