import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import prisma from './db';
import { User } from '@prisma/client';

export async function validateToken(): Promise<any> {
  const cookieStore = cookies();
  const authorization = cookieStore.get('Authorization');
  if (!authorization) {
    return { error: 'No Token' };
  }
  const token = authorization.value;
  const secret = process.env.JWT_SECRET || 'asdf';

  let verify: any;
  try {
    verify = jwt.verify(token, secret);
  } catch {
    return { error: 'Invalid Token' };
  }

  const user: Partial<User> | null = await prisma.user.findUnique({
    where: { email: verify.email },
  });
  return { user };
}
