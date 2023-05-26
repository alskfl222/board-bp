import { NextRequest, NextResponse } from 'next/server';
import prisma from '@util/db';
import { validateToken } from '@util/auth';
import { Post } from '@prisma/client';

export async function POST(
  request: NextRequest,
  { params }: { params: { board: string } }
) {
  const user = await validateToken();
  if ('error' in user)
    return NextResponse.json({ error: user.error }, { status: 400 });

  const boardName = params.board;
  const board = await prisma.board.findUnique({ where: { name: boardName } });

  if (!board)
    return NextResponse.json({ error: 'Invaild Board Name' }, { status: 400 });

  const { title, content } = await request.json();
  if (!title || !content)
    return NextResponse.json({ error: 'Invaild Info' }, { status: 400 });

  try {
    const res: Post = await prisma.post.create({
      data: {
        author: { connect: { id: user.id } },
        board: { connect: { id: board.id } },
        title,
        content,
      },
    });
    return NextResponse.json(
      { post: res },
      { headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 400 });
  }
}

export async function OPTIONS() {
  return NextResponse.json('OPTIONS!');
}
