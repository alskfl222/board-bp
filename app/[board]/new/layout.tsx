export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section
      className='flex w-full min-h-screen p-2 flex-col items-center justify-between
                 border border-dashed border-yellow-500'
    >
      {children}
    </section>
  );
}
