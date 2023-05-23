'use client';

import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@comp/Editor'), {
  ssr: false,
});

export default async function CreatePost() {
  const ref = useRef<any>(null);

  const convertImageToIframe = (html: string) => {
    const regex = /https:\/\/img\.youtube\.com\/vi\/(.+?)\/hqdefault\.jpg/g;
    let match;
    const videoIds = [];

    while ((match = regex.exec(html)) !== null) {
      videoIds.push(match[1]);
    }

    let resultHTML = html;
    for (const videoId of videoIds) {
      const imageHTML =
      `<p><img src="https://img.youtube.com/vi/${videoId}/hqdefault.jpg" contenteditable="false"><br></p>`;
      const videoHTML = 
      `<div><iframe width="560" height="315" src="https://www.youtube.com/embad/${videoId}" title="Youtube player" frameborder="0" allowfullscreen></iframe></div>`;
      resultHTML = resultHTML.replace(imageHTML, videoHTML);
    }
    return resultHTML;
  };

  const onChange = () => {
    const content = ref.current.getInstance().getHTML();
    const converted = convertImageToIframe(content)
    console.log(converted);
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

