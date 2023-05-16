import { NextRequest, NextResponse } from 'next/server';
import * as bcrypt from 'bcrypt';
import prisma from '@/util/db';
import { User } from '@prisma/client';
import { validateToken } from '@util/auth';

export async function GET() {
  const user = await validateToken();
  if (user.error)
    return NextResponse.json({ error: user.error }, { status: 400 });
  delete user.password;
  return NextResponse.json(user);
}

export async function PUT(request: NextRequest) {
  const user = await validateToken(true);
  if (user.error)
    return NextResponse.json({ error: user.error }, { status: 400 });

  const body = await request.json();
  const { email, name, password, newPassword } = body;

  if (!email || !name || !password)
    return NextResponse.json({ error: 'Invaild Info' }, { status: 400 });

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
