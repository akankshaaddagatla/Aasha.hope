import React, { useState } from "react";
import Link from "next/link";
import Logo from "./Logo";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <nav className="flex justify-between items-center sticky top-0 z-50 bg-white p-7">
      <Logo />
      <div className="flex gap-20">
        <Link 
          href="/ngos" 
          className="text-gray-700 hover:text-red-600 font-medium transition-colors"
        >
          NGOs
        </Link>
        <Link 
          href="/campaigns" 
          className="text-gray-700 hover:text-red-600 font-medium transition-colors"
        >
          Campaigns
        </Link>
        <Link 
          href="/about" 
          className="text-gray-700 hover:text-red-600 font-medium transition-colors"
        >
          About
        </Link>
        <Link 
          href={isLoggedIn ? "/profile" : "/login"} 
          className="text-gray-700 hover:text-red-600 font-medium transition-colors"
        >
          {isLoggedIn ? "Profile" : "Login"}
        </Link>
      </div>
    </nav>
  );
}