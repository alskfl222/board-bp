export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className='w-full flex flex-col border items-center border-fuchsia-300'>
      <div className='w-full h-24 flex justify-center items-center border border-fuchsia-500'>
        <h1>AUTH!</h1>
      </div>
      {children}
    </section>
  );
}
