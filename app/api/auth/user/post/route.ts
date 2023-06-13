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
  const take = 2;
  const skip = (page - 1) * take;

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
      degree_sum: true,
    },
    orderBy:
      type === 'latest'
        ? { createdAt: 'desc' }
        : type === 'view'
        ? { view: 'desc' }
        : { degree_sum: 'desc' },
    take,
    skip,
  });

  const posts = res.map((post) => {
    return {
      ...post,
      board: post.board.name,
    };
  });
  return NextResponse.json({ posts });
}
