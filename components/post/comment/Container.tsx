'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import axios from 'axios';
import Item from './item/Item';
import { getFetchUrl } from '@util/fetch';
import Input from './Input';
import useSWR, { KeyedMutator } from 'swr';

export interface Comment {
  id: number;
  postId: number;
  parentId: number | null;
  author: string;
  authorId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
  mutate: KeyedMutator<any>;
}

export default function Container() {
  const pathname = usePathname();
  const fetchUrl = getFetchUrl(`${pathname}/comment`);

  const { data, isLoading, mutate } = useSWR(fetchUrl, (url) =>
    axios.get(url).then((res) => res.data)
  );

  if (isLoading) return <div>로딩중</div>;
  const comments = data.comments as Comment[];

  console.log(data);

  return (
    <div className='border border-lime-300'>
      댓글
      <div className='p-2 flex flex-col gap-4'>
        {comments.length > 0 ? (
          comments.map((comment) => {
            return <Item key={comment.id} {...comment} mutate={mutate} />;
          })
        ) : (
          <div>댓글 없음</div>
        )}
      </div>
      <Input />
    </div>
  );
}
