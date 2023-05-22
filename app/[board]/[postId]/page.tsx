import prisma from '@util/db';

export default async function Post({
  params,
}: {
  params: { board: string; postId: string };
}) {
  const postId = parseInt(params.postId);
  const post = await prisma.post.findUnique({ where: { id: postId } });
  return <div>{post?.content}</div>;
}
