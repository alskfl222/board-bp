'use client';

import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@comp/Editor'), {
  ssr: false,
});

export default async function CreatePost() {
  const ref = useRef<any>(null);

  const onChange = () => {
    const content = ref.current.getInstance().getHTML();
    console.log(content);
  };

  return (
    <div className='w-full'>
      <Editor
        editorRef={ref}
        onChange={onChange}
      />
    </div>
  );
}

