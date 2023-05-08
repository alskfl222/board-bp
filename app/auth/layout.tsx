export default function BoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section
      className='min-h-screen p-24 flex flex-col items-center
                 border border-white'
    >
      <div className='border border-white'>AUTH!</div>
      {children}
    </section>
  );
}
