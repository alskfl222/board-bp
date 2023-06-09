import { NextRequest, NextResponse } from 'next/server';
import prisma from '@db';
import { validateToken } from '@auth';

export async function PUT(
  req: NextRequest,
  {
    params,
  }: {
    params: { board: string; postId: string; commentId: string };
  }
) {
  const user = await validateToken();
  if ('error' in user)
    return NextResponse.json({ error: user.error }, { status: 400 });

  const board = params.board;
  const postId = parseInt(params.postId);
  const commentId = parseInt(params.commentId);

  if (!board || !postId || !commentId)
    return NextResponse.json({ error: 'Invalid Info' }, { status: 404 });
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });
  if (!comment)
    return NextResponse.json({ error: 'Invalid commentId' }, { status: 404 });

  const sentiment = await prisma.commentSentiment.findFirst({
    where: { userId: user.id, commentId },
  });

  const { degree } = await req.json();
  if (sentiment) {
    const res = await prisma.commentSentiment.update({
      where: { id: sentiment.id },
      data: { degree },
    });
    return NextResponse.json({ sentiment: res });
  } else {
    const res = await prisma.commentSentiment.create({
      data: {
        user: { connect: { id: user.id } },
        comment: { connect: { id: comment.id } },
        degree,
      },
    });
    return NextResponse.json({ sentiment: res });
  }
}
