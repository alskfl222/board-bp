'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import axios from 'axios';
import Item from './Item';
import { getFetchUrl } from '@util/fetch';
import Input from './Input';

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
  fetchData: () => Promise<void>;
}

export default function Container() {
  const pathname = usePathname();
  const [comments, setComments] = useState<Comment[]>([]);
  const fetchUrl = getFetchUrl(`${pathname}/comment`);

  const fetchData = useCallback(async () => {
    try {
      const res = await axios.get(fetchUrl).then((res) => res.data);
      setComments(res.comments);
    } catch (err) {
      console.log(err);
    }
  }, [fetchUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className='p-2 border border-lime-300'>
      댓글
      {comments.length > 0 ? (
        comments.map((comment) => {
          return <Item key={comment.id} {...comment} fetchData={fetchData} />;
        })
      ) : (
        <div>댓글 없음</div>
      )}
      <Input />
    </div>
  );
}
