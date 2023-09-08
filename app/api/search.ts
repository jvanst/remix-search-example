let apiURL = new URL('https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&utf8=1&formatversion=2');
let params = new URLSearchParams(apiURL.search);

export const search = async (query: string) => {
  params.append('srsearch', query);
  apiURL.search = params.toString();

  const response = await fetch(apiURL.toString());

  if (!response.ok) {
    throw new Error('Failed to fetch api');
  }

  return await response.json()
}