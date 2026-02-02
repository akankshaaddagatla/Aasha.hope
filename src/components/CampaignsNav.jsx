"use client"

import React from 'react';

export default function CampaignsNav() {
  return (
    <div className="relative w-full h-54 md:h-50">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-center bg-cover"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cG9vciUyMHBlb3BsZXxlbnwwfHwwfHx8MA%3D%3D")',
        }}
      >
        {/* dark overlay */}
        <div className="absolute inset-0 bg-black/40"></div> 
      </div>
     
      <div className="relative pl-5 pt-5">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
          Donate hope. Donate life
        </h1>
        <p className="text-lg text-white/90 max-w-2xl">
          Be their ray of hope today
        </p>
      </div>
    </div>
  );
}