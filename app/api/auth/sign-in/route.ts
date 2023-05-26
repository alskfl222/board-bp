import { NextRequest, NextResponse } from 'next/server';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '@util/db';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password } = body;

  const secret = process.env.JWT_SECRET || 'asdf';

  if (!email || !password)
    return NextResponse.json({ message: 'Invaild info' }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user)
    return NextResponse.json({ message: 'Not found user' }, { status: 400 });

  const verify = await bcrypt.compare(password, user.password);

  if (verify) {
    const token = jwt.sign({ name: user.name, email: user.email }, secret, {
      expiresIn: 60 * 60,
    });
    const response = NextResponse.json({ message: 'OK' });
    response.cookies.set('auth', token, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      expires: new Date().getTime() + 60 * 60 * 1000,
    });
    return response;
  }
  return NextResponse.json({ message: 'Invalid password' }, { status: 400 });
}

export async function OPTIONS() {
  return NextResponse.json('OPTIONS!');
}