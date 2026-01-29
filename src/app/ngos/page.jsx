"use client";

import NgoCard from "@/components/NgoCard";
import { useState, useEffect } from "react";
import { getVerifiedNgos } from "../actions/ngo.actions";
import NgoNav from "@/components/NgoNav";

export default function NgosBrowse() {
  const [ngos, setngos] = useState([]);
  const [loading, setLoading] = useState(true);

  const getNgos = async () => {
    try {
      const { data, error } = await getVerifiedNgos();
      if (error) {
        console.Error("Error", error.message);
      } else {
        setngos(data || []);
      }
    } catch (error) {
      console.Error("Error fetching NGOs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getNgos();
  },[]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading NGOs...</div>
      </div>
    );
  }

  return (
    <div>
      <NgoNav />
      <div className="my-10 mx-25 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {ngos.map((ngo) => (
          <NgoCard key={ngo.id} ngo={ngo} />
        ))}
      </div>
      {ngos.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No NGOs found. Create some to get started.
        </div>
      )}
    </div>
  );
}
