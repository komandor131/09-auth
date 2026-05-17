import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

import AuthProvider from "@/components/AuthProvider/AuthProvider";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://notehub.goit.study"),
  title: "NoteHub",
  description: "A simple application for managing personal notes.",
  openGraph: {
    title: "NoteHub",
    description: "A simple application for managing personal notes.",
    url: "https://notehub.goit.study",
    images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

const RootLayout = ({ children, modal }: RootLayoutProps) => {
  return (
    <html lang="en">
      <body className={roboto.variable}>
        <TanStackProvider>
          <AuthProvider>
            <Header />
            {children}
            {modal}
            <Footer />
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
};

export default RootLayout;
