export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className='relative w-full flex flex-col items-center
                        border border-fuchsia-500 overflow-hidden'>
      {children}
    </section>
  );
}
