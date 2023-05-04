import { getData } from '../util';

export default async function BoardList(props: any) {
  const data = await getData(__dirname.split('app')[1], props);

  return data.message;
}
