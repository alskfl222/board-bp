import { useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import useSWR from 'swr';
import Loading from '@comp/Loading';
import { getFetchUrl } from '@util';

type Item = {
  id: number;
  path: string;
  name: string;
  listId: number;
};

export default function Items({ name }: { name: string }) {
  console.log(name)
  const fetchUrl = getFetchUrl(`/emoticon/${name}`);

  const { data, isLoading } = useSWR(fetchUrl, (url) =>
    axios.get(url).then((res) => res.data)
  );

  if (isLoading) return <Loading />;
  // console.log(data)
  const items = data.list as any[];

  return (
    <div>
      <div className='p-2 flex gap-2 border'>
        {items.map((item) => {
          console.log(`/emoticon/${name}/${item.path}`)
          return (
            <div key={item.id} className=''>
              <Image
                src={`/emoticon/${name}/${item.path}`}
                alt={item.name}
                title={item.name}
                width={100}
                height={100}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
