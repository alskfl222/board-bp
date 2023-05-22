export default function BoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section
      className='flex w-full min-h-screen p-2 flex-col items-center justify-between
                 border border-yellow-300'
    >
      {children}
    </section>
  );
}
