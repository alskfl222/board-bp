'use client';

import { usePathname } from 'next/navigation';
import axios from 'axios';
import useSWR from 'swr';
import Input from './Input';
import Item from './item/Item';
import Loading from '@comp/Loading';
import { getFetchUrl } from '@util';
import { Comment, CommentProvider } from '@context/Comment';
import { EmoticonProvider } from '@context/Emoticon';
import { useUserStore } from '@store/user';

export default function Container() {
  const pathname = usePathname();
  const fetchUrl = getFetchUrl(`${pathname}/comment`);
  const isLogin = useUserStore((state) => state.isLogin);

  const { data, isLoading, mutate } = useSWR(fetchUrl, (url) =>
    axios.get(url).then((res) => res.data)
  );

  if (isLoading) return <Loading />;
  const comments = data.comments as Comment[];

  return (
    <div className='border border-lime-300'>
      <div className='p-2'>댓글</div>
      <div className='p-2 flex flex-col gap-4'>
        {comments.length > 0 ? (
          comments.map((comment) => {
            return (
              <CommentProvider
                key={comment.id}
                initialValue={{ ...comment, mutate }}
              >
                <Item />
              </CommentProvider>
            );
          })
        ) : (
          <div>댓글 없음</div>
        )}
      </div>
      {isLogin && (
        <EmoticonProvider>
          <Input mutate={mutate} />
        </EmoticonProvider>
      )}
    </div>
  );
}
