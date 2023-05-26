import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  if (request.nextUrl.pathname.startsWith('/api')) {
    response.headers.append(
      'Access-Control-Allow-Origin',
      'http://localhost:3000'
    );
    response.headers.append(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS'
    );
  }
  console.log(Array.from(response.headers.keys()))

  return response;
}
