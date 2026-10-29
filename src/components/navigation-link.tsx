"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

export function NavigationLink(props: ComponentProps<typeof Link>) {
  const pathname = usePathname();
  const href = String(props.href);
  const active = pathname === href || pathname.startsWith(`${href}/`);
  return <Link {...props} aria-current={active ? "page" : undefined} />;
}
