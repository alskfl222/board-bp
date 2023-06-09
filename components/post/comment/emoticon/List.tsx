'use client';

import { useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import useSWR from 'swr';
import Loading from '@comp/Loading';
import { getFetchUrl } from '@util';
import Items from './Items';

export default function List() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [idx, setIdx] = useState(-1);
  const fetchUrl = getFetchUrl('/emoticon');

  const { data, isLoading } = useSWR(fetchUrl, (url) =>
    axios.get(url).then((res) => res.data)
  );

  if (isLoading) return <Loading />;
  const list = data.list as any[];

  const onClickList = (index: number) => {
    if (index !== idx) {
      setIdx(index);
      setIsExpanded(true);
    } else {
      setIdx(-1);
      setIsExpanded(false);
    }
  };

  return (
    <div className='flex flex-col gap-2'>
      {list.length > 0 ? (
        <div className='flex'>
          {list.map((item, index) => {
            return (
              <div key={item.id}>
                <div onClick={() => onClickList(index)}>
                  <Image
                    src={`/emoticon/${item.name}/${item.thumbnail}`}
                    alt={item.presented}
                    title={item.presented}
                    width={100}
                    height={100}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div>넌 이모티콘이 없다</div>
      )}
      {isExpanded && idx > -1 && <Items name={list[idx].name} />}
    </div>
  );
}
