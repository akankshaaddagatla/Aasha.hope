"use client";

import React from "react";
import { useEffect, useState } from "react";
import { getUser, signOut } from "@/app/actions/auth.actions";
import Link from "next/link";
import Logo from "./Logo";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const { data: user } = await getUser();
      setUser(user);
    }
    loadUser();
  }, [pathname]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setShowDropdown(false);
  }, [pathname]);

  const handleLogout = async () => {
    setUser(null);
    setShowDropdown(false);
    setMobileMenuOpen(false);
    await signOut();
    router.push("/");
  };

  return (
    <nav className="flex justify-between items-center sticky top-0 z-50 bg-white p-7">
      <Logo />
      <div className="ml-5 hidden min-[890px]:flex gap-12">
        <Link
          href="/"
          className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
        >
          Home
        </Link>
        <Link
          href="/ngos"
          className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
        >
          NGOs
        </Link>
        <Link
          href="/campaigns"
          className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
        >
          Campaigns
        </Link>
        <Link
          href="/createCampaign"
          className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
        >
          Start a Campaign
        </Link>
        <Link
          href="/about"
          className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
        >
          About
        </Link>
        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                {user?.name?.charAt(0) || "U"}
              </div>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                <Link
                  href={`/users/${user.role}/dashboard`}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Dashboard
                </Link>
                <Link
                  href={`/users/${user.role}`}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
          >
            Login
          </Link>
        )}
      </div>

      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="hidden max-[890px]:block text-gray-700 focus:outline-none"
      >
        ☰
      </button>

      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full text-center bg-white shadow-lg min-[890px]:hidden">
          <div className="flex flex-col p-4 gap-4">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link href="/ngos" onClick={() => setMobileMenuOpen(false)}>
              NGOs
            </Link>
            <Link href="/campaigns" onClick={() => setMobileMenuOpen(false)}>
              Campaigns
            </Link>
            <Link
              href="/createCampaign"
              onClick={() => setMobileMenuOpen(false)}
            >
              Start a Campaign
            </Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)}>
              About
            </Link>

            {user ? (
              <>
                <Link
                  href={`/users/${user.role}/dashboard`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href={`/users/${user.role}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
