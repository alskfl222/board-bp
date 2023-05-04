import { headers } from 'next/headers';

export async function fetchData() {
  const headersList = headers();
  const path = headersList.get('x-invoke-path');
  const query = headersList.get('x-invoke-query');
  
  const serverUrl = 'http://localhost:3001/api';

  const fetchUrl = serverUrl + path + query;

  const res = await fetch(fetchUrl, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
}
