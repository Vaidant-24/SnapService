import "./globals.css";
import { Inter } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SnapService App",
  description: "Find trusted professionals for all your home service needs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-gray-50 flex flex-col min-h-screen`}
      >
        <AuthProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Toaster richColors position="top-right" />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
