import { fetchInter } from '@util/fetchInter';

export default async function BoardList() {
  const data = await fetchInter();
  console.log(data);

  return "DB ACCESS DIRECTLY";
}
