import Link from "next/link";

export default function SubMenu({
  menus,
  logout,
}: {
  menus: Record<string, Record<string, string>>;
  logout?: () => Promise<void>;
}): JSX.Element {
  return (
    <>
      {Object.values(menus).map((menu) => {
        return (
          <Link href={{ pathname: menu.path }} key={menu.path}>
            {menu.name}
          </Link>
        );
      })}
      {logout && <button onClick={logout}>로그 아웃</button>}
    </>
  );
}
