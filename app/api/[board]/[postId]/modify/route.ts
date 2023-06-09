import { NextRequest, NextResponse } from 'next/server';
import prisma from '@db';
import { validateToken } from '@auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: { board: string; postId: string } }
) {
  const user = await validateToken();
  if ('error' in user)
    return NextResponse.json({ error: user.error }, { status: 400 });

  const postId = parseInt(params.postId);
  const { title, content } = await request.json();

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post)
    return NextResponse.json({ error: 'Invalid Post ID' }, { status: 400 });
  if (post.authorId !== user.id)
    return NextResponse.json({ error: 'Not Your Post' }, { status: 403 });

  try {
    const res = await prisma.post.update({
      where: { id: post.id },
      data: { title, content },
    });
    return NextResponse.json({ post: res }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err }, { status: 400 });
  }
}
