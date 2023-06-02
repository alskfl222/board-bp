import { Dispatch, SetStateAction } from 'react';

function isMine(authorId: number) {
  const userId = sessionStorage.getItem('userId');
  if (!userId) return false;
  return parseInt(userId) === authorId;
}

export function Read({
  parentId,
  authorId,
  setMode,
  onClickDelete,
}: {
  parentId: number | null;
  authorId: number;
  setMode: Dispatch<SetStateAction<'recomment' | 'modify' | 'read'>>;
  onClickDelete: () => Promise<void>;
}) {
  return (
    <div>
      {!parentId && (
        <button onClick={() => setMode('recomment')}>대댓글</button>
      )}
      {isMine(authorId) && (
        <>
          <button onClick={() => setMode('modify')}>수정</button>/
          <button onClick={onClickDelete}>삭제</button>
        </>
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
