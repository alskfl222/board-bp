import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@db';
import { validateToken } from '@auth';

export async function GET(
  req: NextRequest,
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
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: { author: true, sentiments: true },
  });
  if (!post)
    return NextResponse.json({ error: 'Invalid postId' }, { status: 404 });

  const cookieStore = cookies();
  const preView = cookieStore.get('pre-view')
    ? (JSON.parse(cookieStore.get('pre-view')!.value) as number[])
    : [];

  const postData = { ...post, author: post.author.name };

  if (!preView.includes(postId)) {
    const pre = preView.length >= 100 ? preView.slice(-100) : preView;
    const response = NextResponse.json({
      post: postData,
    });
    response.cookies.set('pre-view', JSON.stringify([...pre, postId]), {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      expires: new Date().getTime() + 60 * 60 * 1000,
    });
    await prisma.post.update({
      where: { id: postId },
      data: { view: { increment: 1 } },
    });
    return response;
  }

  return NextResponse.json({
    post: postData,
  });
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
