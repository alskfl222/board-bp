import prisma from '@util/db';
import { redirect } from 'next/navigation';

export default async function BoardList({
  params,
}: {
  params: { board: string };
}) {
  const board = await prisma.board.findUnique({
    where: { name: params.board },
  });
  if (!board) {
    redirect('/')
  }
  return 'DB ACCESS DIRECTLY';
}
