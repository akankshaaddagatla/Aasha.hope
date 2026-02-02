import React from "react";

export default function NgoNav() {
  return (
    <div className="relative w-full h-54 md:h-50">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1643024629363-fff4775a12e7?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
        }}
      >
        {/* dark overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="relative pl-5 pt-5">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
          Support Causes That Matter
        </h1>
        <p className="text-lg text-white/90 max-w-2xl">
          Discover and donate to verified NGOs creating real impact
        </p>
      </div>
    </div>
  );
}
