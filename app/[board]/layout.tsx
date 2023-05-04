export default function BoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className='flex min-h-screen flex-col items-center justify-between p-24'>
      {children}
    </section>
  );
}
