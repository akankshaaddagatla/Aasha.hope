"use client"
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full h-[85vh] min-h-[650px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <img
        src="https://imgs.search.brave.com/z4ZkwM6sSGbr80_fGg1TnGIlsjx9ZE0QDZajGjacaPA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/b3Jmb25saW5lLm9y/Zy9wdWJsaWMvdXBs/b2Fkcy9wb3N0cy9p/bWFnZS9IdW5nZXIt/aW4tSW5kaWEuanBn"
        alt="Helping hands"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl px-6 text-center text-white">
        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
          Small Help.
          <br />
          <span className="text-green-400">Big Change.</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-3xl mx-auto">
          Someone is waiting for help today.
          <br />
          Support verified NGOs across India and create real impact in minutes.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/ngos"
          className="bg-green-600 hover:bg-green-700 transition px-8 py-4 rounded-xl text-lg font-semibold shadow-xl">
            Explore NGOs
          </Link>

          <Link href="/campaigns"
          className="bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white/20 transition px-8 py-4 rounded-xl text-lg font-semibold">
            Explore Campaigns
          </Link>
        </div>

        {/* Trust Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20">
            <p className="text-3xl font-bold">₹12L+</p>
            <p className="text-gray-300 text-sm">Funds Raised</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20">
            <p className="text-3xl font-bold">8K+</p>
            <p className="text-gray-300 text-sm">Donors</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20">
            <p className="text-3xl font-bold">120+</p>
            <p className="text-gray-300 text-sm">Campaigns</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20">
            <p className="text-3xl font-bold">100%</p>
            <p className="text-gray-300 text-sm">Transparency</p>
          </div>
        </div>
      </div>
    </section>
  );
}