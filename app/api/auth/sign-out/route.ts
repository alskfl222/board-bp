import { NextResponse } from 'next/server';

export async function DELETE() {
  return NextResponse.json(
    { message: 'OK' },
    {
      status: 200,
      headers: {
        'Set-Cookie': 'Authorization=; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
      },
    }
  );
}
