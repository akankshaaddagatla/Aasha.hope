"use client";

import NgoCard from "@/components/NgoCard";
import { useState, useEffect } from "react";
import ViewMore from "@/components/viewmore";
import { getVerifiedNgos } from "./actions/ngo.actions";
import { getVerifiedCampaigns } from "./actions/campaign.actions";
import CampaignCard from "@/components/CampaignCard";
import Hero from "@/components/HeroSection";

export default function Home() {
  const [ngos, setngos] = useState([]);
  const [campaigns, setcampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const getNgos = async () => {
    try {
      const { data, error } = await getVerifiedNgos();
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

  const getCampaigns = async () => {
    try {
      const { data, error } = await getVerifiedCampaigns();
      if (error) {
        console.error("Error", error.message);
      } else {
        setcampaigns(data || []);
      }
    } catch (error) {
      console.error("Error fetching Campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getNgos();
    getCampaigns();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading NGOs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Hero />
      <div>
        <div className="text-center pt-10">
          <h1 className="text-3xl font-bold text-blue-600">Support NGOs</h1>
          <p className="text-lg">
            Be the steady hand that lifts someone up every single day
          </p>
        </div>
        <div className="mt-10 mx-25 ">
          {ngos.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              No NGOs found. Create some to get started.
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {ngos.slice(0,6).map((ngo) => (
                  <NgoCard key={ngo.id} ngo={ngo} />
                ))}
              </div>
              <ViewMore link="/ngos" />
            </div>
          )}
        </div>
      </div>
      <div>
        <div className="text-center pt-5">
          <h1 className="text-3xl font-bold text-blue-600">
            Support a Campaign
          </h1>
          <p className="text-lg">
            Be the steady hand that lifts someone up every single month
          </p>
        </div>
        <div className="m-10 mx-25 ">
          {campaigns.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              No Campaigns found. Create some to get started.
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {campaigns.slice(0,6).map((cam) => (
                  <CampaignCard key={cam.id} campaign={cam} />
                ))}
              </div>
              <ViewMore link="/campaigns" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
