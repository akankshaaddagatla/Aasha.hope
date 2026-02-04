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
  title: "Aasha.hope",
  description: "Donate to verified NGOs and campaigns, follow ngos to observe their work.",
  keywords: ["donation", "NGO", "charity", "non-profit"],
  authors: [{ name: "Your Name" }],
  openGraph: {
    title: "Aasha.hope",
    description: "Support verified NGOs and campaigns",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js" async />
      </head>
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
