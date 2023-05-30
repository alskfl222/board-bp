import { NextRequest, NextResponse } from 'next/server';
import prisma from '@util/db';
import { validateToken } from '@util/auth';

export async function GET(
  _: NextRequest,
  { params }: { params: { board: string; postId: string } }
) {
  const res = await prisma.comment.findMany({
    where: { postId: parseInt(params.postId) },
    include: { author: true },
  });

  const processed = res.map((comment) => {
    return {
      ...comment,
      author: comment.author.name,
      authorId: undefined,
    };
  });

  const comments = processed.filter((comment) => !comment.parentId);
  const re = processed.filter((comment) => comment.parentId);

  re.forEach((comment) => {
    const root = comments.find((root) => root.id === comment.parentId) as any;
    if (!root) return;
    if (!root.comments) root.comments = [];
    root.comments = [...root.comments, comment];
  });

  return NextResponse.json({ comments });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { board: string; postId: string } }
) {
  const user = await validateToken();
  if ('error' in user)
    return NextResponse.json({ error: user.error }, { status: 400 });

  const { parentId, content } = await request.json();

  try {
    const res = await prisma.comment.create({
      data: {
        authorId: user.id as number,
        postId: parseInt(params.postId),
        parentId: (parentId as number) || null,
        content,
      },
    });
    const comment = {
      ...res,
      author: user.name,
      authorId: undefined,
    };
    return NextResponse.json(comment, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  const user = await validateToken();
  if ('error' in user)
    return NextResponse.json({ error: user.error }, { status: 400 });

  const { id, content } = await request.json();

  try {
    const res = await prisma.comment.update({
      where: { id: parseInt(id) },
      data: {
        content,
      },
    });
    return NextResponse.json(res, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err }, { status: 400 });
  }
}

export async func