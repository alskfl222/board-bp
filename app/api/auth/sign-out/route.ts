import { NextResponse } from 'next/server';

export async function DELETE() {
  const response = NextResponse.json({ message: 'OK' });
  response.cookies.set('auth', '', {
    expires: new Date(0),
  });
  return response;
}
