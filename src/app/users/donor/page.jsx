"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUserProfile } from "@/app/actions/users.actions";
import { getSuccessfulDonations } from "@/app/actions/donation.actions";

export default function DonorProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    const { data, error } = await getCurrentUserProfile();
    const { data: donations } = await getSuccessfulDonations();
    if (error) {
      console.error(error);
    } else {
      setProfile(data);
      setDonations(donations || []);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {profile?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {profile?.name}
                </h1>
                <p className="text-gray-600 text-lg">{profile?.email}</p>
                <div className="mt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Donor
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => router.push("/users/editUserProfile")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Edit
            </button>
          </div>
        </div>

        {/* Impact Summary */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl shadow-lg p-8 text-white mb-6">
          <h2 className="text-2xl font-bold mb-4">Your Impact</h2>
          <p className="text-lg opacity-90 mb-6">
            Thank you for your generosity! Your contributions have made a real
            difference in people's lives.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm opacity-90">Campaigns Supported</p>
              <p className="text-2xl font-bold mt-2">
                {
                  [
                    ...new Set(
                      donations.map((d) => d.campaign_id).filter(Boolean),
                    ),
                  ].length
                }
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm opacity-90">NGOs Supported</p>
              <p className="text-2xl font-bold mt-2">
                {
                  [...new Set(donations.map((d) => d.ngo_id).filter(Boolean))]
                    .length
                }
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm opacity-90">Member Since</p>
              <p className="text-2xl font-bold mt-2">
                {profile?.created_at
                  ? new Date(profile.created_at).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                    })
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Recent Donations */}
        <div className="bg-white rounded-xl shadow-2xl p-6">
          <h2 className="text-2xl font-bold mb-4">Recent Donations</h2>
          {donations && donations.length > 0 ? (
            <div className="space-y-4">
              {donations.slice(0, 5).map((donation) => (
                <div
                  key={donation.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-green-500">
                        {donation.ngo_id ? "NGO" : "Campaign"}
                      </p>
                      <p className="font-semibold">
                        {donation.ngos?.name ||
                          donation.campaigns?.title ||
                          "Unknown"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(
                          donation.donated_at || donation.created_at,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
                      ₹{Number(donation.amount).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No donations yet</p>
          )}
        </div>

      </div>
    </div>
  );
}
