'use client';

import { usePathname } from 'next/navigation';
import axios from 'axios';
import useSWR from 'swr';
import Input from './Input';
import Item from './item/Item';
import Loading from '@comp/Loading';
import { EmoticonItem } from '@store/emoticon';
import { EmoticonProvider } from '@hook/useEmoticon';
import { getFetchUrl } from '@util';

export interface Comment {
  id: number;
  postId: number;
  parentId: number | null;
  author: string;
  authorId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  emoticons: EmoticonItem[];
  comments: Comment[];
}

export default function Container() {
  const pathname = usePathname();
  const fetchUrl = getFetchUrl(`${pathname}/comment`);

  const { data, isLoading, mutate } = useSWR(fetchUrl, (url) =>
    axios.get(url).then((res) => res.data)
  );

  if (isLoading) return <Loading />;
  const comments = data.comments as Comment[];

  return (
    <div className='border border-lime-300'>
      댓글
      <div className='p-2 flex flex-col gap-4'>
        {comments.length > 0 ? (
          comments.map((comment) => {
            return (
              <EmoticonProvider key={comment.id}>
                <Item {...comment} mutate={mutate} />
              </EmoticonProvider>
            );
          })
        ) : (
          <div>댓글 없음</div>
        )}
      </div>
      <EmoticonProvider>
        <Input mutate={mutate} />
      </EmoticonProvider>
    </div>
  );
}
