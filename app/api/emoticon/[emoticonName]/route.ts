import { NextRequest, NextResponse } from 'next/server';
import prisma from '@db';

export async function GET(
  _: NextRequest,
  { params }: { params: { emoticonName: string } }
) {
  const emoticonList = await prisma.emoticonList.findUnique({
    where: { name: params.emoticonName },
  });
  if (!emoticonList)
    return NextResponse.json({ error: 'Invaild emoticonName' });
  const list = await prisma.emoticon.findMany({
    where: { listId: emoticonList.id },
  });
  return NextResponse.json({ list });
}
