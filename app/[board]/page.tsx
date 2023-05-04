import { getPageData } from '../util';

export default async function BoardList() {
  const data = await getPageData();

  return data.message;
}
