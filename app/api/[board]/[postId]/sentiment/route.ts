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

  const sentiments = await prisma.postSentiment.groupBy({
    by: ['postId'],
    _sum: {
      degree: true,
    },
    where: {
      postId: postId,
    },
  });

  const degreeSum = sentiments[0]._sum.degree || 0;

  await prisma.post.update({
    where: { id: postId },
    data: { degree_sum: degreeSum },
  });
  return NextResponse.json({ sentiment: res });
}
