import { NextRequest, NextResponse } from 'next/server';
import prisma from '@db';
import { validateToken } from '@auth';

export async function GET(
  _: NextRequest,
  {
    params,
  }: {
    params: { board: string; postId: string };
  }
) {
  const board = params.board;
  const postId = parseInt(params.postId);

  if (!board || !postId)
    return NextResponse.json({ error: 'Invalid Info' }, { status: 404 });
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post)
    return NextResponse.json({ error: 'Invalid postId' }, { status: 404 });
  return NextResponse.json({ post });
}

export async function DELETE(
  _: NextRequest,
  {
    params,
  }: {
    params: { board: string; postId: string };
  }
) {
  const user = await validateToken();
  if ('error' in user)
    return NextResponse.json({ error: user.error }, { status: 400 });

  const postId = parseInt(params.postId);
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post)
    return NextResponse.json({ error: 'Invalid postId' }, { status: 400 });
  const board = await prisma.board.findUnique({
    where: { name: params.board },
  });
  if (!board)
    return NextResponse.json({ error: 'Invalid board' }, { status: 400 });
  const admin = await prisma.admin.findFirst({
    where: { userId: user.id, boardId: board.id },
  });
  if (!admin && user.id !== post?.authorId)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const res = await prisma.post.delete({ where: { id: postId } });
  return NextResponse.json(res);
}
