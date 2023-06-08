import Image from 'next/image';
import { CommentHook } from '@context/Comment';

export default function Selected({
  selected,
  remove,
}: Pick<CommentHook, 'selected' | 'remove'>) {
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
