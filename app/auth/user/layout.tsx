export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className='w-full px-4 py-8 flex flex-col border items-center border-fuchsia-500'>
      {children}
    </section>
  );
}
