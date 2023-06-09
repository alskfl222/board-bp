export default function BoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section
      className='w-full min-h-[calc(100vh-3rem)] p-2 flex flex-col border border-yellow-300'
    >
      {children}
    </section>
  );
}
