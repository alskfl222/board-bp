import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/util/db';

export async function POST(request: NextRequest) {
  const reqData = await request.formData();
  const email = reqData.get('email') as string | null;
  const name = reqData.get('name') as string | null;

  if (!email || !name)
    return NextResponse.json({ message: 'Invaild Info' }, { status: 400 });

  try {
    const res = await prisma.user.create({ data: { email, name } });
    return NextResponse.json({ data: res });
  } catch (e) {
    return NextResponse.json({ message: e }, { status: 400 });
  }
}
