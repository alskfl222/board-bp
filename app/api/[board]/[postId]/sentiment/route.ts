import { NextRequest, NextResponse } from 'next/server';
import prisma from '@db';
import { validateToken } from '@auth';

export async function PUT(
  req: NextRequest,
  {
    params,
  }: {
    params: { board: string; postId: string };
  }
) {
  const user = await validateToken();
  if ('error' in user)
    return NextResponse.json({ error: user.error }, { status: 400 });

  const board = params.board;
  const postId = parseInt(params.postId);

  if (!board || !postId)
    return NextResponse.json({ error: 'Invalid Info' }, { status: 404 });
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });
  if (!post)
    return NextResponse.json({ error: 'Invalid postId' }, { status: 404 });

  const sentiment = await prisma.postSentiment.findFirst({
    where: { userId: user.id, postId },
  });

  const { degree } = await req.json();
  if (sentiment) {
    const res = await prisma.postSentiment.update({
      where: { id: sentiment.id },
      data: { degree },
    });
    return NextResponse.json({ sentiment: res });
  } else {
    const res = await prisma.postSentiment.create({
      data: {
        user: { connect: { id: user.id } },
        post: { connect: { id: post.id } },
        degree,
      },
    });
    return NextResponse.json({ sentiment: res });
  }
}
