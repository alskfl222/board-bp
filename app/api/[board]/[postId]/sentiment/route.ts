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

  const sentiments = await prisma.postSentiment.findMany({
    where: { userId: user.id, postId },
  });

  if (sentiments.length > 1) {
    for (let i = 1; i < sentiments.length; i++) {
      await prisma.postSentiment.delete({ where: { id: sentiments[i].id } });
    }
  }

  const sentiment = sentiments[0];

  const { degree } = await req.json();
  let res: any;
  if (sentiment) {
    res = await prisma.postSentiment.update({
      where: { id: sentiment.id },
      data: { degree },
    });
  } else {
    res = await prisma.postSentiment.create({
      data: {
        user: { connect: { id: user.id } },
        post: { connect: { id: post.id } },
        degree,
      },
    });
  }

  const totalSentiments = await prisma.postSentiment.groupBy({
    by: ['postId'],
    _sum: {
      degree: true,
    },
    where: {
      postId: postId,
    },
  });

  const degreeSum = totalSentiments[0]._sum.degree || 0;

  await prisma.post.update({
    where: { id: postId },
    data: { degree_sum: degreeSum },
  });
  return NextResponse.json({ sentiment: res });
}
