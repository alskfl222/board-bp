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

  const sentiments = await prisma.commentSentiment.findMany({
    where: { userId: user.id, commentId },
  });

  if (sentiments.length > 1) {
    for (let i = 1; i < sentiments.length; i++) {
      await prisma.commentSentiment.delete({ where: { id: sentiments[i].id } });
    }
  }

  const sentiment = sentiments[0];

  const { degree } = await req.json();
  let res: any;
  if (sentiment) {
    res = await prisma.commentSentiment.update({
      where: { id: sentiment.id },
      data: { degree },
    });
  } else {
    res = await prisma.commentSentiment.create({
      data: {
        user: { connect: { id: user.id } },
        comment: { connect: { id: comment.id } },
        degree,
      },
    });
  }

  const totalSentiments = await prisma.commentSentiment.groupBy({
    by: ['commentId'],
    _sum: {
      degree: true,
    },
    where: {
      commentId: commentId,
    },
  });

  const degreeSum = totalSentiments[0]._sum.degree || 0;

  await prisma.comment.update({
    where: { id: commentId },
    data: { degree_sum: degreeSum },
  });
  return NextResponse.json({ sentiment: res });
}
