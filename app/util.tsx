import { headers } from "next/headers";

export async function getPageData() {
  const headersList = headers()
  const path = headersList.get('x-invoke-path')
  const query = decodeURI(headersList.get('x-invoke-query')!)
  const serverUrl = 'http://localhost:3001/api';

  let fetchUrl = serverUrl + path;

  Object.entries(query).forEach((entry, index, array) => {
    if (index === 0) fetchUrl = fetchUrl + '?';
    const [key, value] = entry;
    if (Array.isArray(value)) {
      value.forEach((q, i) => {
        fetchUrl = fetchUrl + `${key}=${q}`;
        if (i < value.length - 1) fetchUrl = fetchUrl + '&';
      });
    } else if (value) {
      fetchUrl = fetchUrl + `${key}=${value}`;
    } else {
      fetchUrl = fetchUrl + `${key}=`;
    }
    if (index < array.length - 1) fetchUrl = fetchUrl + '&';
  });
  const res = await fetch(fetchUrl, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
}
