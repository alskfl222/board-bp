import { NextRequest, NextResponse } from 'next/server';
import * as bcrypt from 'bcrypt';
import { prisma } from '@/util/db';

export async function POST(request: NextRequest) {
  const reqData = await request.formData();
  const email = reqData.get('email') as string | null;
  const password = reqData.get('password') as string | null;

  if (!email || !password)
    return NextResponse.json({ message: 'Invaild info' }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user)
    return NextResponse.json({ message: 'Not found user' }, { status: 400 });

  const verify = await bcrypt.compare(password, user.password);

  if (verify) {
    return NextResponse.json({ message: 'OK' });
  }
  return NextResponse.json({ message: 'Invalid password' }, { status: 400 });
}
