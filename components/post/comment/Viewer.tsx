'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import axios from 'axios';
import CommentItem from './Comment';
import { getFetchUrl } from '@util/fetch';

export default function CommentViewer() {
  const pathname = usePathname();
  const [comments, setComments] = useState<any[]>([]);
  const fetchUrl = getFetchUrl(`${pathname}/comment`);

  useEffect(() => {
    async function initData() {
      try {
        const res = await axios.get(fetchUrl);
        setComments(res.data.comments);
      } catch (err) {
        console.log(err);
      }
    }
    initData();
  }, [fetchUrl]);

  console.log(comments);

  return (
    <div>
      {comments.length > 0 ? (
        comments.map((comment) => {
          return <CommentItem key={comment.id} {...comment} />;
        })
      ) : (
        <div>댓글 없음</div>
      )}
    </div>
  );
}
