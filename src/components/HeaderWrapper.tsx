"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function HeaderWrapper() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  // If we are on an admin page, don't render the header at all
  if (isAdmin) return null;

  // Otherwise, render the normal Header
  return <Header />;
}