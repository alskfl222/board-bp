export default function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section
      className='w-full flex flex-col border border-yellow-500'
    >
      {children}
    </section>
  );
}
