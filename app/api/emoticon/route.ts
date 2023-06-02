import { NextResponse } from 'next/server';
import prisma from '@db';

export async function GET() {
  const list = await prisma.emoticonList.findMany();
  return NextResponse.json({ list });
}
