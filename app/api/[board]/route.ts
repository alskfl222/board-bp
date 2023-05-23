import { NextRequest, NextResponse } from 'next/server';
import prisma from '@util/db';
import { validateToken } from '@util/auth';
import { Post } from '@prisma/client';

export async function POST(request: NextRequest) {
  const user = await validateToken();
  if ('error' in user)
    return NextResponse.json({ error: user.error }, { status: 400 });

  const { board: boardName, title, content } = await request.json();
  // console.log(boardName, title, content)
  const board = await prisma.board.findUnique({ where: { name: boardName } });

  if (!board)
    return NextResponse.json({ error: 'Invaild Board Name' }, { status: 400 });

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
      { data: res },
      { headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 400 });
  }
}

export async function OPTIONS() {
  return new Response('Hello!', {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, auth',
    },
  });
}