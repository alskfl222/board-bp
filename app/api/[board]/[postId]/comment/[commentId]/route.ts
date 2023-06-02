import { NextRequest, NextResponse } from 'next/server';
import { validateToken } from '@auth';
import prisma from '@db';

export async function DELETE(
  _: NextRequest,
  {
    params,
  }: {
    params: { board: string; postId: string; commentId: string };
  }
) {
  const user = await validateToken();
  if ('error' in user)
    return NextResponse.json({ error: user.error }, { status: 400 });
  const commentId = parseInt(params.commentId);
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment)
    return NextResponse.json({ error: 'Invalid comment Id' }, { status: 400 });

  const board = await prisma.board.findUnique({
    where: { name: params.board },
  });
  if (!board)
    return NextResponse.json({ error: 'Invalid board' }, { status: 400 });
  const admin = await prisma.admin.findFirst({
    where: { userId: user.id, boardId: board.id },
  });
  if (!admin && user.id !== comment.authorId)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const res = await prisma.comment.delete({ where: { id: commentId } });
  return NextResponse.json(res);
}
