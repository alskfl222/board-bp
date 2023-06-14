'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { getFetchUrl } from '@util';
import axios from 'axios';
import Loading from '@comp/Loading';
import Table from './Table';
import Pagination from '@comp/pagination/Client';

export type Post = {
  id: number;
  board: string;
  title: string;
  createdAt: string;
  degree_sum: number;
  view: number;
};

export type ListType = 'latest' | 'view' | 'like';

export default function List() {
  const searchParams = useSearchParams();

  const [type, setType] = useState<ListType>('latest');
  const [pp, setPp] = useState(
    searchParams.get('pp') && !isNaN(parseInt(searchParams.get('pp')!))
      ? parseInt(searchParams.get('pp') || '1')
      : 1
  );

  const fetchUrl = getFetchUrl(`/auth/user/post?type=${type}&pp=${pp}`);
  const { data, isLoading } = useSWR(fetchUrl, () =>
    axios.get(fetchUrl).then((res) => res.data)
  );

  if (isLoading) return <Loading />;

  const count = data.count as number;
  const posts = data.posts as Post[];

  return (
    <div className='w-full p-2 border'>
      <span>Post</span>
      <Table posts={posts} type={type} setType={setType} />
      <Pagination count={count} page={pp} setPage={setPp} />
    </div>
  );
}
