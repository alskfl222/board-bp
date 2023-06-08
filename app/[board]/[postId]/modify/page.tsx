'use client';

import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Editor from '@comp/editor/Editor';
import { useUserStore } from '@store/user';
import { exceptionHandler, getFetchUrl } from '@util';

export default function ModifyPost({
  params,
}: {
  params: { board: string; postId: string };
}) {
  const router = useRouter();
  const isLogin = useUserStore((state) => state.isLogin);
  const [title, setTitle] = useState('');
  const titleRef = useRef<HTMLInputElement | null>(null);
  const editorRef = useRef<any>(null);
  const fetchUrl = getFetchUrl(`/${params.board}/${params.postId}`);

  useEffect(() => {
    if (!isLogin) router.push(`/${params.board}`);

    async function init() {
      try {
        const { post } = await axios.get(fetchUrl).then((res) => res.data);
        setTitle(post.title);

        if (editorRef.current)
          editorRef.current.getInstance().setHTML(post.content);
      } catch (err) {
        console.log(err);
      }
    }
    init();
    // eslint-disable-next-line
  }, [router, isLogin, params, fetchUrl]);

  const onSubmit = async () => {
    // const rawHTML = editorRef.current.getInstance().getHTML();
    // const contentHTML = convertImageToIframe(rawHTML);
    const contentHTML = editorRef.current.getInstance().getHTML();
    const body = {
      board: params.board,
      title,
      content: contentHTML,
    };
    try {
      const response = await axios.put(`${fetchUrl}/modify`, body);
      router.push(`/${params.board}/${response.data.post.id}`);
    } catch (err) {
      exceptionHandler(err)
    }
  };

  return (
    <div className='w-full flex flex-col gap-4'>
      <h3>제목</h3>
      <input
        ref={titleRef}
        className='text-[#333]'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className='border-b border-dashed border-neutral-100' />
      <h3>내용</h3>
      <Editor editorRef={editorRef} />
      <div className='border-b border-dashed border-neutral-100' />
      <button onClick={onSubmit}>생성</button>
    </div>
  );
}
