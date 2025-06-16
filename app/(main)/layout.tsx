import Footer from "@/components/common/footer";
import { Navbar } from "@/components/common/navbar";
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
