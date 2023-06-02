import { NextRequest, NextResponse } from 'next/server';
import * as bcrypt from 'bcrypt';
import prisma from '@db';
import { User } from '@prisma/client';
import { validateToken } from '@auth';

export async function GET() {
  const user = await validateToken();
  if ('error' in user)
    return NextResponse.json({ error: user.error }, { status: 400 });
  delete user.password;
  return NextResponse.json(user);
}

export async function POST(request: NextRequest) {
  const reqData = await request.formData();
  const email = reqData.get('email') as string | null;
  const name = reqData.get('name') as string | null;
  const password = reqData.get('password') as string | null;

  if (!email || !name || !password)
    return NextResponse.json({ error: 'Invaild Info' }, { status: 400 });

  const salt = process.env.SALT as string;
  const hashedPassword = await bcrypt.hash(password, parseInt(salt));

  try {
    const res: Partial<User> = await prisma.user.create({
      data: { email, name, password: hashedPassword },
    });
    delete res.password;
    return NextResponse.json({ data: res });
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  const user = await validateToken(true);
  if ('error' in user)
    return NextResponse.json({ error: user.error }, { status: 400 });

  const body = await request.json();
  const { email, name, password, newPassword } = body;

  if (!email || !name || !password)
    return NextResponse.json({ error: 'Invaild Info' }, { status: 400 });

  const verify = await bcrypt.compare(password, user.password!);
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
  const user = await validateToken();

  if ('error' in user)
    return NextResponse.json({ error: user.error }, { status: 400 });

  await prisma.user.delete({ where: { id: user.id } });
  return NextResponse.json({ message: 'OK' });
}

export async function OPTIONS() {
  return NextResponse.json('OPTIONS!');
}
