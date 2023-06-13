'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { getFetchUrl } from '@util';
import axios from 'axios';
import Loading from '@comp/Loading';
import { commonMenus } from '@data/menu';
import { toDateString } from '@util';

type Post = {
  id: number;
  board: string;
  title: string;
  createdAt: string;
  view: number;
};

export default function PostList() {
  const searchParams = useSearchParams();
  const [type, setType] = useState<'latest' | 'view' | 'like'>('latest');
  const page =
    searchParams.get('page') && isNaN(parseInt(searchParams.get('page')!))
      ? parseInt(searchParams.get('page') || '1')
      : 1;

  const fetchUrl = getFetchUrl(`/auth/user/post?type=${type}&page=${page}`);
  const { data, isLoading } = useSWR(fetchUrl, () =>
    axios.get(fetchUrl).then((res) => res.data)
  );

  if (isLoading) return <Loading />;

  const posts = data.posts as Post[];
  console.log(posts[0]);

  return (
    <div className='w-full p-2 border'>
      <span>Post</span>
      <table className='w-full p-2 flex flex-col'>
        <thead>
          <tr className='w-full grid grid-cols-12 border border-yellow-500'>
            <th className='flex justify-center border-x border-dashed border-yellow-700'>
              ID
            </th>
            <th className='col-span-7 px-4 border-r border-dashed border-yellow-700'>
              제목
            </th>
            <th className='col-span-2 flex justify-center border-r border-dashed border-yellow-700'>
              게시판
            </th>
            <th className='col-span-2 flex justify-center border-r border-dashed border-yellow-700'>
              작성시간
            </th>
          </tr>
        </thead>
        <tbody>
          {posts.length > 0 ? (
            posts.map((post) => {
              return (
                <tr
                  key={post.id}
                  className='w-full grid grid-cols-12 border border-yellow-500'
                >
                  <td className='flex justify-center border-x border-dashed border-yellow-700'>
                    {post.id}
                  </td>
                  <td className='col-span-7 px-4 border-r border-dashed border-yellow-700'>
                    <Link
                      href={{
                        pathname: `/${post.board}/${post.id}`,
                      }}
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className='col-span-2 flex justify-center border-r border-dashed border-yellow-700'>
                    {commonMenus[post.board].name}
                  </td>
                  <td className='col-span-2 flex justify-center border-r border-dashed border-yellow-700 text-sm'>
                    {toDateString(post.createdAt)}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>쓴 글 없음</tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
