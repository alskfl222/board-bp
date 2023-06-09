import { NextResponse } from 'next/server';
import prisma from '@db';
import { validateToken } from '@auth';

export async function GET() {
  const user = await validateToken();
  if ('error' in user)
    return NextResponse.json({ error: user.error }, { status: 400 });

  const userEmoticons = await prisma.userEmoticon.findMany({
    where: { userId: user.id },
    select: {
      list: true,
    },
  });

  return NextResponse.json({
    list: userEmoticons.map((item) => {
      return {
        ...item.list,
      };
    }),
  });
}
