import { NextRequest, NextResponse } from 'next/server';
import * as bcrypt from 'bcrypt';
import { prisma } from '@/util/db';

export async function POST(request: NextRequest) {
  const reqData = await request.formData();
  const email = reqData.get('email') as string | null;
  const name = reqData.get('name') as string | null;
  const password = reqData.get('password') as string | null;

  if (!email || !name || !password)
    return NextResponse.json({ message: 'Invaild Info' }, { status: 400 });

  const salt = process.env.SALT as string;
  const hashedPassword = await bcrypt.hash(password, parseInt(salt));

  try {
    const res = await prisma.user.create({
      data: { email, name, password: hashedPassword },
    });
    return NextResponse.json({ data: res });
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 400 });
  }
}
