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
      <main className="flex-grow">{children}</main>
      <Footer />
    </section>
  );
}
