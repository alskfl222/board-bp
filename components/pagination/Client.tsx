import Link from 'next/link';
import { Dispatch, SetStateAction } from 'react';

export default function Pagination({
  count,
  page,
  setPage,
}: {
  count: number;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
}) {
  const maxPage = Math.ceil(count / 15);
  const startPage = page - (page % 10) + 1;
  const endPage =
    maxPage < startPage + (10 - 1) ? maxPage : startPage + (10 - 1);

  function getPageList() {
    const pageList = [];
    for (let i = startPage; i <= endPage; i += 1) {
      pageList.push(i);
    }
    return pageList;
  }

  const pageList = getPageList();

  return (
    <div className='flex gap-2'>
      {page > 1 && <button onClick={() => setPage(page - 1)}>{'<'}</button>}
      {pageList.length > 1 &&
        pageList.map((page, idx) => {
          return (
            <button key={page} onClick={() => setPage(startPage + idx)}>
              {page}
            </button>
          );
        })}
      {page < maxPage && (
        <button onClick={() => setPage(page + 1)}>{'>'}</button>
      )}
    </div>
  );
}
