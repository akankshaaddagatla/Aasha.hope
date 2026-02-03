"use client";

import CampaignCard from "@/components/CampaignCard";
import { useState, useEffect } from "react";
import CampaignsNav from "@/components/CampaignsNav";
import { getVerifiedCampaigns } from "../actions/campaign.actions";

export default function CampaignBrowse() {
  const [campaigns, setcampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const getCampaigns = async () => {
    try {
      const { data, error } = await getVerifiedCampaigns();

      if (error) {
        console.error("Error", error.message);
      } else {
        setcampaigns(data);
      }
    } catch (error) {
      console.error("Error fetching Campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCampaigns();
  },[]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading Campaigns...</div>
      </div>
    );
  }

  return (
    <div>
      <CampaignsNav />
      <div className="my-10 mx-25 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {campaigns.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>
      {campaigns.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No Campaigns found. Create some to get started.
        </div>
      )}
    </div>
  );
}
