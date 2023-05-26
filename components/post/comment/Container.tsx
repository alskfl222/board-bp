import CommentInput from './Input';
import CommentViewer from './Viewer';

export default function CommentContainer() {
  return (
    <div className='p-2 border border-lime-300'>
      <div>댓글</div>
      <CommentInput />
      <CommentViewer />
    </div>
  );
}
