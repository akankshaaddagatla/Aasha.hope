"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUserProfile } from "@/app/actions/users.actions";
import { getMyNGO } from "@/app/actions/ngo.actions";
import Link from "next/link";

export default function DonorProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ngo, setNgo] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    const { data, error } = await getCurrentUserProfile();
    const { data: ngo, error: NgoError } = await getMyNGO();
    if (error || NgoError) {
      console.error(error || NgoError);
    } else {
      setProfile(data);
      setNgo(ngo);
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
                    NGO
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => router.push("/users/editUserProfile")}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              ✏️ Edit Profile
            </button>
          </div>
        </div>

        {ngo != null ?
         (
          <div className="bg-white rounded-2xl shadow-xl mb-6 overflow-hidden">
          {/* Cover Image */}
          <div className="w-full h-56">
            <img
              src={ngo?.cover_image_url}
              alt="NGO Cover"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="flex items-start justify-between flex-wrap gap-6">
              {/* Left Section */}
              <div className="flex items-center gap-6">
                <img
                  src={ngo?.logo_url}
                  alt="NGO Logo"
                  className="w-24 h-24 mt-2 rounded-full object-cover border-4 border-white shadow-md bg-white"
                />

                <div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {ngo?.name}
                  </h2>

                  <p className="text-green-700 font-medium mt-1">
                    {ngo?.cause_statement}
                  </p>

                  <span
                    className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                      ngo?.verification_status === "verified"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {ngo?.verification_status}
                  </span>
                </div>
              </div>

              {/* Edit Button */}
              <button
                onClick={() => router.push("/users/editUserProfile")}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                ✏️ Edit Your NGO
              </button>
            </div>

            {/* Description */}
            <p className="text-gray-600 mt-6 max-w-3xl">{ngo?.description}</p>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Funding Progress</span>
                <span>
                  {Math.min(
                    (ngo?.amount_raised / ngo?.amount_raising) * 100,
                    100,
                  ).toFixed(0)}
                  %
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full"
                  style={{
                    width: `${Math.min(
                      (ngo?.amount_raised / ngo?.amount_raising) * 100,
                      100,
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Raised</p>
                <p className="text-lg font-bold">
                  ₹{ngo?.amount_raised?.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Goal</p>
                <p className="text-lg font-bold">
                  ₹{ngo?.amount_raising?.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Total Donations</p>
                <p className="text-lg font-bold">{ngo?.total_donations}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Followers</p>
                <p className="text-lg font-bold">{ngo?.followers_count}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg col-span-2 md:col-span-4">
                <p className="text-sm text-gray-500">Created At</p>
                <p className="text-lg font-bold">
                  {ngo?.created_at
                    ? new Date(ngo.created_at).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
         )  : 
         (
          <div className="w-full bg-white h-90 shadow-2xl rounded-xl p-5 flex items-center justify-center">
            <div className="text-center">
              <p className="mb-4">No NGO Registered yet</p>
              <Link href="/users/ngo/dashboard/registerNgo" className="bg-blue-500 hover:bg-blue-700 text-white p-3 rounded-xl">Register Now</Link>
            </div>
          </div>
          
         )
        }
        

      </div>
    </div>
  );
}
