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
    searchParams.get('cp') && !isNaN(parseInt(searchParams.get('cp')!))
      ? parseInt(searchParams.get('cp') || '1')
      : 1;
  const take = 10;
  const skip = (page - 1) * take;

  const count = await prisma.comment.count({ where: { authorId: user.id } });

  const res = await prisma.comment.findMany({
    where: {
      authorId: user.id,
    },
    select: {
      id: true,
      post: {
        select: {
          id: true,
          title: true,
          board: {
            select: {
              name: true,
            },
          },
        },
      },
      content: true,
      emoticons: {
        select: {
          emoticon: {
            select: {
              name: true,
              path: true,
              list: {
                select: {
                  name: true,
                  presented: true,
                },
              },
            },
          },
        },
      },
      createdAt: true,
      degree_sum: true,
    },
    orderBy: type === 'latest' ? { createdAt: 'desc' } : { degree_sum: 'desc' },
    take,
    skip,
  });

  const comments = res.map((comment) => {
    return {
      ...comment,
      board: comment.post.board.name,
      postId: comment.post.id,
      post: comment.post.title,
      emoticons: comment.emoticons.map((emoticon) => {
        return {
          list: emoticon.emoticon.list.name,
          name: `${emoticon.emoticon.list.presented}_${emoticon.emoticon.name}`,
          path: emoticon.emoticon.path,
        };
      }),
    };
  });
  return NextResponse.json({ count, comments });
}
