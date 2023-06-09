import { NextResponse } from 'next/server';
import { validateToken } from '@auth';

export async function GET() {
  const user = await validateToken();
  if ('error' in user)
    return NextResponse.json({ error: user.error }, { status: 400 });
  return NextResponse.json({ message: 'OK' });
}
