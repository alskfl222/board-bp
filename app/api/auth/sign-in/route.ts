import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '@util/db';

export async function POST(request: NextRequest) {
  const reqData = await request.formData();
  const email = reqData.get('email') as string | null;
  const password = reqData.get('password') as string | null;

  const secret = process.env.JWT_SECRET || 'asdf';

  if (!email || !password)
    return NextResponse.json({ message: 'Invaild info' }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user)
    return NextResponse.json({ message: 'Not found user' }, { status: 400 });

  const verify = await bcrypt.compare(password, user.password);

  const cookieStore = cookies();

  if (verify) {
    const token = jwt.sign({ name: user.name, email: user.email }, secret, {
      expiresIn: 60 * 60,
    });
    return NextResponse.json(
      { message: 'OK' },
      {
        status: 200,
        headers: {
          'Set-Cookie': `Authorization=${token}; path=/; samesite=lax; httponly`,
        },
      }
    );
  }
  return NextResponse.json({ message: 'Invalid password' }, { status: 400 });
}
