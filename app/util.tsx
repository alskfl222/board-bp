export async function getData(path: string, props: any) {
  // const path = __dirname.split('app')[1];
  const { params, searchParams } = props;
  const serverUrl = 'http://localhost:3002/api';

  let fetchUrl = serverUrl + path;

  Object.entries(params).forEach((entry) => {
    const [key, value] = entry;
    fetchUrl = fetchUrl.replace(`[${key}]`, value as string);
  });

  Object.entries(searchParams).forEach((entry, index, array) => {
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
