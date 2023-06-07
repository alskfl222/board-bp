import Image from 'next/image';
import { useEmoticonStore } from '@store/emoticon';

export default function Selected() {
  const { selected, remove } = useEmoticonStore();
  return (
    <div>
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
