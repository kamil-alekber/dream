export function parseQueryToURL(baseUrl: string, query: Record<string, any>) {
  let url = baseUrl;
  Object.keys(query).forEach((key, i) => {
    url += `${i === 0 ? '?' : '&'}${key}=${query[key]}`;
  });
  return url;
}
