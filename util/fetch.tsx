import { headers } from 'next/headers';

export async function fetchInter(option?: RequestInit) {
  const headersList = headers();

  const proto = headersList.get('x-forwarded-proto');
  const host = headersList.get('x-forwarded-host');
  const path = headersList.get('x-invoke-path');
  const query = headersList.get('x-invoke-query');

  const serverUrl = `${proto}://${host}/api`;

  const fetchUrl = serverUrl + path + query;

  const res = await fetch(fetchUrl, {
    cache: 'no-store',
    ...option,
  });
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
}
