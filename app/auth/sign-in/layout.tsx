export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className='w-full flex flex-col border items-center border-fuchsia-500'>
      {children}
    </section>
  );
}
