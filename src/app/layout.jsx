import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "NGO Connect",
  description: "Donate to verified NGOs",
  keywords: ["donation", "NGO", "charity", "non-profit"],
  authors: [{ name: "Your Name" }],
  openGraph: {
    title: "NGO Connect",
    description: "Support verified NGOs",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-gray-50`}
        
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
