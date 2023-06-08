import { useContext } from 'react';
import Image from 'next/image';
import axios from 'axios';
import useSWR from 'swr';
import Loading from '@comp/Loading';
import { EmoticonItem, EmoticonContext } from '@context/Emoticon';
import { getFetchUrl } from '@util';

export default function Items({ name }: { name: string }) {
  const fetchUrl = getFetchUrl(`/emoticon/${name}`);

  const { data, isLoading } = useSWR(fetchUrl, (url) =>
    axios.get(url).then((res) => res.data)
  );
  const { isExist, add, remove } = useContext(EmoticonContext);

  if (isLoading) return <Loading />;
  const items = data.list as EmoticonItem[];

  const onClickEmoticon = (item: EmoticonItem) => {
    if (!isExist(item)) {
      add(item);
    } else {
      remove(item);
    }
  };

  return (
    <div>
      <div className='p-2 flex gap-2 border'>
        {items.map((item) => {
          return (
            <div key={item.id} className=''>
              <Image
                src={`/emoticon/${item.kind}/${item.path}`}
                alt={item.name}
                title={item.name}
                width={100}
                height={100}
                onClick={() => onClickEmoticon(item)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
