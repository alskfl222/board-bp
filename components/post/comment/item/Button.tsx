import { useContext } from 'react';
import { CommentContext } from '@context/Comment';

function isMine(authorId: number) {
  const userId = sessionStorage.getItem('userId');
  if (!userId) return false;
  return parseInt(userId) === authorId;
}

export function Read({ onClickDelete }: { onClickDelete: () => void }) {
  const { author, authorId, setMode, onClickRecomment } =
    useContext(CommentContext);
  return (
    <div className='flex flex-col gap-1 text-sm'>
      <button onClick={() => onClickRecomment(author)}>대댓글</button>
      {isMine(authorId) && (
        <div className='flex gap-1'>
          <button onClick={() => setMode('modify')}>수정</button>/
          <button onClick={onClickDelete}>삭제</button>
        </div>
      )}
    </div>
  );
}

export function Modify({
  onSubmit,
  onClickCancel,
}: {
  onSubmit: any;
  onClickCancel: any;
}) {
  return (
    <div>
      <button onClick={onSubmit}>확인</button>
      <button onClick={onClickCancel}>취소</button>
    </div>
  );
}
