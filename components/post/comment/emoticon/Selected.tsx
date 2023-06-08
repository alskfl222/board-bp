import { useContext } from 'react';
import Image from 'next/image';
import { EmoticonContext } from '@hook/useEmoticon';

export default function Selected() {
  const { selected, remove } = useContext(EmoticonContext);
  return (
    <div className='flex gap-2'>
      {selected.length > 0 &&
        selected.map((item) => {
          return (
            <div key={item.id} className=''>
              <Image
                src={`/emoticon/${item.kind}/${item.path}`}
                alt={item.name}
                title={item.name}
                width={100}
                height={100}
                onClick={() => remove(item)}
              />
            </div>
          );
        })}
    </div>
  );
}
