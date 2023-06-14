'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { getFetchUrl } from '@util';
import axios from 'axios';
import Loading from '@comp/Loading';
import Table from './Table';
import Pagination from '@comp/pagination/Client';

export type Comment = {
  id: number;
  board: string;
  postId: number;
  post: string;
  content: string;
  emoticons: { list: string; name: string; path: string }[];
  createdAt: string;
  degree_sum: number;
};

export type ListType = 'latest' | 'view' | 'like';

export default function List() {
  const searchParams = useSearchParams();

  const [type, setType] = useState<ListType>('latest');
  const [cp, setCp] = useState(
    searchParams.get('cp') && !isNaN(parseInt(searchParams.get('cp')!))
      ? parseInt(searchParams.get('cp') || '1')
      : 1
  );

  const fetchUrl = getFetchUrl(`/auth/user/comment?type=${type}&cp=${cp}`);
  const { data, isLoading } = useSWR(fetchUrl, () =>
    axios.get(fetchUrl).then((res) => res.data)
  );

  if (isLoading) return <Loading />;

  const count = data.count as number;
  const comments = data.comments as Comment[];

  return (
    <div className='w-full p-2 border'>
      <span>Comment</span>
      <Table comments={comments} type={type} setType={setType} />
      <Pagination count={count} page={cp} setPage={setCp} />
    </div>
  );
}
