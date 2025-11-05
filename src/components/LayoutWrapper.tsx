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

  const hiddenPrefixes = ["/dashboard", "/login", "/signup"];

  const hideNavbar = hiddenPrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  );

  return (
    <>
      {!hideNavbar && <Navbar />}
      <ClientProgressBar />
      <main>{children}</main>
    </>
  );
}
