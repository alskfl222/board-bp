import { NextRequest, NextResponse } from 'next/server';
import * as bcrypt from 'bcrypt';
import prisma from '@/util/db';
import { User } from '@prisma/client';
import { validateToken } from '@/util/auth';

export async function GET() {
  const user = await validateToken();

  if (user)
    return NextResponse.json({ error: 'Not Found User' }, { status: 400 });

  delete user.password;
  return NextResponse.json(user);
}

export async function PUT(request: NextRequest) {
  const reqData = await request.formData();
  const email = reqData.get('email') as string | null;
  const name = reqData.get('name') as string | null;
  const password = reqData.get('password') as string | null;
  const newPassword = reqData.get('newPassword') as string | null;

  if (!email || !name || !password)
    return NextResponse.json({ error: 'Invaild Info' }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user)
    return NextResponse.json({ error: 'Not Found User' }, { status: 400 });

  const verify = await bcrypt.compare(password, user.password);
  if (!verify)
    return NextResponse.json({ error: 'Invalid Password' }, { status: 400 });

  const saltRound = process.env.SALT_ROUND as string;
  const updatePassword = newPassword
    ? await bcrypt.hash(newPassword, parseInt(saltRound))
    : user.password;

  try {
    const updated: Partial<User> = await prisma.user.update({
      where: { email },
      data: { email, name, password: updatePassword },
    });
    delete updated.password;
    return NextResponse.json({ user: updated });
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 400 });
  }
}

export async function DELETE() {
  const validate = await validateToken();

  if (validate.error)
    return NextResponse.json({ error: validate.error }, { status: 400 });
  if (!validate.user)
    return NextResponse.json({ error: 'Not Found User' }, { status: 404 });

  await prisma.user.delete({ where: { id: validate.user.id } });
  return NextResponse.json({ message: 'OK' });
}
