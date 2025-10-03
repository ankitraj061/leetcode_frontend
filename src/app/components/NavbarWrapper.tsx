// app/components/NavbarWrapper.tsx
'use client';

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";

export default function NavbarWrapper() {
  const pathname = usePathname();
  const { isAuthenticated } = useSelector((state: any) => state.auth);

  const hideNavbar =
    pathname?.startsWith('/problems/') ||
    pathname?.startsWith('/contest/') ||
    pathname === '/editor';

  if (hideNavbar || !isAuthenticated) return null;
  return <Navbar />;
}
