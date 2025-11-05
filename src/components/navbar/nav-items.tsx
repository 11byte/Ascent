"use client";

import { cn } from "../lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Variant = "desktop" | "mobile";

export default function NavItems({
  variant = "desktop",
  className,
}: {
  variant?: Variant;
  className?: string;
}) {
  const pathname = usePathname();

  const items = [
    { href: "/explore", label: "Explore" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/roadmap", label: "Roadmap" },
  ];

  if (variant === "mobile") {
    // Clean vertical list with a soft left accent for the active link
    return (
      <nav aria-label="Mobile navigation" className={cn("flex flex-col gap-2", className)}>
        {items.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} aria-current={active ? "page" : undefined}>
              <div
                className={cn(
                  "relative flex items-center rounded-lg px-3 py-2 transition-colors",
                  "bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-md",
                  active ? "ring-1 ring-white/25" : "ring-0"
                )}
              >
                <span
                  className={cn(
                    "absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-full",
                    "bg-gradient-to-b from-cyan-400 via-sky-400 to-emerald-400",
                    active ? "opacity-100" : "opacity-0"
                  )}
                />
                <span className={cn("text-sm font-semibold", active ? "text-white" : "text-white/85")}>
                  {label}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>
    );
  }

  // Desktop: ghost links with subtle gradient underline
  return (
    <nav aria-label="Primary navigation" className={cn("hidden lg:flex items-center gap-6", className)}>
      {items.map(({ href, label }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative group px-0.5 py-1 text-sm font-semibold tracking-wide",
              active ? "text-white" : "text-white/85 hover:text-white transition-colors"
            )}
          >
            {label}
            {/* Gradient underline only on active/hover */}
            <span
              className={cn(
                "pointer-events-none absolute left-1/2 -translate-x-1/2 -bottom-1",
                "h-[2px] w-0 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400",
                "transition-all duration-300",
                active ? "w-6" : "group-hover:w-6"
              )}
            />
          </Link>
        );
      })}
    </nav>
  );
}