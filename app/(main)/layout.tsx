import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <Navbar />
      <main className="flex-grow bg-[#f5f7f9]">{children}</main>
      <Footer />
    </section>
  );
}
