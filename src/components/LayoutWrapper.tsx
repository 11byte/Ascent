"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navig";
import ClientProgressBar from "./ClientProgressBar";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideNavbar =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup");

  return (
    <>
      {!hideNavbar && <Navbar />}
      <ClientProgressBar />
      <main>{children}</main>
    </>
  );
}
