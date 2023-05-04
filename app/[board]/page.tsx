import { fetchData } from '@util/fetch';

export default async function BoardList() {
  const data = await fetchData();

  return data.message;
}
