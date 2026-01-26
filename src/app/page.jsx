"use client";

import NgoCard from "@/components/NgoCard";
import { supabase } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ViewMore from "@/components/viewmore";

export default function Home() {
  const [ngos, setngos] = useState([]);
  const [loading, setLoading] = useState(true);

  const getNgos = async () => {
    try {
      const { data, error } = await supabase.from("ngos").select("*");
      if (error) {
        console.error("Error", error.message);
      } else {
        setngos(data || []);
      }
    } catch (error) {
      console.error("Error fetching NGOs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getNgos();
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading NGOs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div>
        <div className="text-center pt-5">
          <h1 className="text-2xl font-bold text-red-600">Support Monthly</h1>
          <p className="text-lg">
            Be the steady hand that lifts someone up every single month
          </p>
        </div>
        <div className="mt-10 mx-25 ">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {ngos.map((ngo) => (
              <NgoCard key={ngo.id} ngo={ngo} />
            ))}
          </div>
          <ViewMore link="/ngos" />
        </div>
      </div>

      {ngos.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No NGOs found. Create some to get started.
        </div>
      )}
    </div>
  );
}
