import Link from 'next/link';

export default function Pagination({
  pathname,
  count,
  page,
  type = 'page',
}: {
  pathname: string;
  count: number;
  page: number;
  type?: string;
}) {
  function getPageList(count: number, page: number) {
    const maxPage = Math.ceil(count / 15);
    const startPage = page - (page % 10) + 1;
    const endPage =
      maxPage < startPage + (10 - 1) ? maxPage : startPage + (10 - 1);
    const pageList = [];
    for (let i = startPage; i <= endPage; i += 1) {
      pageList.push(i);
    }
    return pageList;
  }

  const pageList = getPageList(count, page);

  return (
    <div>
      {pageList.length > 1 &&
        pageList.map((page) => {
          return (
            <Link key={page} href={{ pathname, query: { [type]: page } }}>
              {page}
            </Link>
          );
        })}
    </div>
  );
}
