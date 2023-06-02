'use client';

import { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import axios from 'axios';
// import Editor from '@comp/Editor';
import { useUserStore } from '@store/user';
import { getFetchUrl } from '@util';

const Editor = dynamic(() => import('@comp/Editor'), {
  ssr: false,
});

const convertImageToIframe = (html: string) => {
  const regex = /https:\/\/img\.youtube\.com\/vi\/(.+?)\/hqdefault\.jpg/g;
  let match;
  const videoIds = [];

  while ((match = regex.exec(html)) !== null) {
    videoIds.push(match[1]);
  }

  let resultHTML = html;
  for (const videoId of videoIds) {
    const imageHTML = `<p><img src="https://img.youtube.com/vi/${videoId}/hqdefault.jpg" contenteditable="false"><br></p>`;
    const videoHTML = `<div><iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" title="Youtube player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
    resultHTML = resultHTML.replace(imageHTML, videoHTML);
  }
  return resultHTML;
};

export default function CreatePost({ params }: { params: { board: string } }) {
  const router = useRouter();
  const isLogin = useUserStore((state) => state.isLogin);
  const [title, setTitle] = useState('');
  const titleRef = useRef<HTMLInputElement | null>(null);
  const editorRef = useRef<any>(null);
  const fetchUrl = getFetchUrl(`/${params.board}`);

  useEffect(() => {
    if (!isLogin) router.push(`/${params.board}`);
  }, [router, isLogin, params]);

  const onSubmit = async () => {
    const rawHTML = editorRef.current.getInstance().getHTML();
    const content = convertImageToIframe(rawHTML);
    const body = {
      board: params.board,
      title,
      content,
    };
    try {
      const response = await axios.post(fetchUrl, body);
      router.push(`/${params.board}/${response.data.post.id}`);
    } catch (err) {
      console.error(err);
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
