'use client';

import { useState, ChangeEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { getFetchUrl } from '@util';
import axios from 'axios';
import Loading from '@comp/Loading';
import Table from './Table';

export type Post = {
  id: number;
  board: string;
  title: string;
  createdAt: string;
  degree_sum: number;
  view: number;
};

type ListType = 'latest' | 'view' | 'like';

export default function List() {
  const searchParams = useSearchParams();
  const [type, setType] = useState<ListType>('latest');
  const page =
    searchParams.get('page') && isNaN(parseInt(searchParams.get('page')!))
      ? parseInt(searchParams.get('page') || '1')
      : 1;

  const onSelectType = (e: ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value as ListType);
  };

  const fetchUrl = getFetchUrl(`/auth/user/post?type=${type}&page=${page}`);
  const { data, isLoading } = useSWR(fetchUrl, () =>
    axios.get(fetchUrl).then((res) => res.data)
  );

  if (isLoading) return <Loading />;

  const posts = data.posts as Post[];
  console.log(posts);

  return (
    <div className='w-full p-2 border'>
      <span>Post</span>
      <div>
        <select value={type} onChange={onSelectType}>
          <option value='latest'>Latest</option>
          <option value='view'>View</option>
          <option value='like'>Like</option>
        </select>
      </div>
      <Table posts={posts} />
    </div>
  );
}
