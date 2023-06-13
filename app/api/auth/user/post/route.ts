import { NextRequest, NextResponse } from 'next/server';
import prisma from '@db';
import { validateToken } from '@auth';

export async function GET(req: NextRequest) {
  const user = await validateToken();
  if ('error' in user)
    return NextResponse.json({ error: user.error }, { status: 400 });
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || 'latest';
  const page =
    searchParams.get('page') && isNaN(parseInt(searchParams.get('page')!))
      ? parseInt(searchParams.get('page') || '1')
      : 1;

  if (type !== 'like') {
    const res = await prisma.post.findMany({
      where: {
        authorId: user.id,
      },
      select: {
        id: true,
        board: {
          select: {
            name: true,
          },
        },
        title: true,
        createdAt: true,
        view: true,
        sentiments: true,
      },
      orderBy: type === 'latest' ? { createdAt: 'desc' } : { view: 'desc' },
    });

    const posts = res.map((post) => {
      return {
        ...post,
        board: post.board.name,
      };
    });
    return NextResponse.json({ posts });
  } else {
    const sentiments = await prisma.postSentiment.groupBy({
      by: ['postId'],
      where: {
        post: {
          authorId: user.id,
        },
      },
      _sum: {
        degree: true,
      },
    });
    console.log(sentiments);
    const res = await prisma.post.findMany({
      where: {
        authorId: user.id,
      },
      select: {
        id: true,
        board: {
          select: {
            name: true,
          },
        },
        title: true,
        createdAt: true,
        view: true,
        sentiments: true,
      },
    });
    const posts = res
      .sort(
        (a, b) =>
          (sentiments.find((post) => post.postId === b.id)
            ? sentiments.find((post) => post.postId === b.id)!._sum.degree || 0
            : 0) -
          (sentiments.find((post) => post.postId === a.id)
            ? sentiments.find((post) => post.postId === a.id)!._sum.degree || 0
            : 0)
      )
      .map((post) => {
        return {
          ...post,
          board: post.board.name,
          sentiments: {
            degree: sentiments.find((item) => item.postId === post.id)
              ? sentiments.find((item) => item.postId === post.id)!._sum
                  .degree || 0
              : 0,
          },
        };
      });
    return NextResponse.json({ posts });
  }
}
