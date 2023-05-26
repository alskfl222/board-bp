'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
// import TuiViewer from '@comp/Viewer';
import { getFetchUrl } from '@util/fetch';
import axios from 'axios';

const Viewer = dynamic(() => import('@comp/Viewer'), {
  ssr: false,
});

export default function Post() {
  const viewerRef = useRef<any>(null);
  const pathname = usePathname();
  const [content, setContent] = useState('asdf');

  useEffect(() => {
    const fetchUrl = getFetchUrl(pathname);
    async function getContent() {
      try {
        const res = await axios.get(fetchUrl);
        setContent(res.data.post.content);
      } catch (err) {
        console.log(err);
      }
    }
    getContent();
  }, [pathname]);

  return (
    <div>
      {/* <iframe
        itemType='text/html'
        width='560'
        height='315'
        src='https://www.youtube.com/embed/5I_elKORA5w'
        title='Youtube player'
        frameBorder='0'
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
        allowFullScreen
      ></iframe> */}
      <Viewer viewerRef={viewerRef} content={content} />
    </div>
  );
}
