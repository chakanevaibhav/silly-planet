import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header/Header";
import { Footer } from "@/components/footer/Footer";
import { AuthProvider } from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: "Silly Planet — Online Shopping for Everyone",
  description: "Shop electronics, books, home goods, and more on Silly Planet.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col bg-[#eaededff]">
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
