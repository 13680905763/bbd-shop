"use client";
import { Image } from "@heroui/react";

import { Navbar, Footer } from "./components";

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <Image alt="HeroUI hero Image" radius="none" src="/images/nav.png" />
      <Navbar />
      <main className="flex-grow bg-[#f5f7f9]">{children}</main>
      <Footer />
    </section>
  );
}
