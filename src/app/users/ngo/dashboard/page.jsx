"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getUser, getUserById } from "@/app/actions/users.actions";
import { getMyNGO } from "@/app/actions/ngo.actions";
import { getCampaignsByNGO, closeCampaign } from "@/app/actions/campaign.actions";
import { getPostsByNGO } from "@/app/actions/posts.actions";
import Link from "next/link";

export default function NGODashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [ngo, setNgo] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [posts, setPosts] = useState([]);
  const [msg, setMsg] = useState('');

  const handleclickClose = async (id) =>{
    const {error} = await closeCampaign(id);
    if(error){
      setMsg("Could'nt close campaign");
    }

    setMsg("Campaign Closed")
  }

  useEffect(() => {
    async function init() {
      try {
        const { data: user } = await getUser();

        if (!user) {
          router.push("/login");
          return;
        }

        const { data: userData } = await getUserById(user.id);
        console.log(userData.role);

        if (userData?.role !== "ngo") {
          router.push("/");
          return;
        }

        const { data: ngoData } = await getMyNGO();

        if (!ngoData) {
          console.log("NO Ngo");
          setNgo(null);
          setLoading(false);
          return;
        }

        setNgo(ngoData);

        const { data: campaigns } = await getCampaignsByNGO(ngoData.id);
        const { data: posts } = await getPostsByNGO(ngoData.id);
        setCampaigns(campaigns || []);
        setPosts(posts || []);
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading dashboard...
      </div>
    );
  }

  if (!ngo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No NGO registered</h1>
          <Link
            href="/users/ngo/dashboard/registerNgo"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Register Your NGO
          </Link>
        </div>
      </div>
    );
  }

  const activeCampaigns = campaigns?.filter((c) => c.status === "active");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-linear-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">{ngo.name}</h1>
          <p className="text-purple-100">NGO Admin Dashboard</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <p className="text-sm text-gray-600 mb-1">Total Followers</p>
            <p className="text-3xl font-bold">{ngo.followers_count || 0}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <p className="text-sm text-gray-600 mb-1">Total Raised</p>
            <p className="text-3xl font-bold">
              ₹{(ngo.amount_raised || 0).toLocaleString()}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <p className="text-sm text-gray-600 mb-1">Active Campaigns</p>
            <p className="text-3xl font-bold">{activeCampaigns.length}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <p className="text-sm text-gray-600 mb-1">Total Donations</p>
            <p className="text-3xl font-bold">{ngo.total_donations || 0}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/users/ngo/dashboard/createPost"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-center transition"
            >
              <svg
                className="w-8 h-8 text-blue-600 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <p className="font-semibold">Post Update</p>
            </Link>

            <Link
              href="/createCampaign"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 text-center transition"
            >
              <svg
                className="w-8 h-8 text-purple-600 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="font-semibold">New Campaign</p>
            </Link>

            <Link
              href={`/ngos/${ngo.id}`}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 text-center transition"
            >
              <svg
                className="w-8 h-8 text-green-600 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <p className="font-semibold">View Public Page</p>
            </Link>

            <Link
              href="/users/ngo/editProfile"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 text-center transition"
            >
              <svg
                className="w-8 h-8 text-orange-600 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                />
              </svg>

              <p className="font-semibold">Edit Profile</p>
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Campaigns */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Your Campaigns</h2>
            {campaigns.length > 0 ? (
              <div className="space-y-4">
                {campaigns.map((campaign) => {
                  const progress =
                    (campaign.amount_raised / campaign.amount_raising) * 100;
                  return (
                    <div key={campaign.id} className="p-4 rounded-lg bg-purple-100">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex">
                            <Link href={`/campaigns/${campaign.id}`} className="font-semibold text-gray-700 mr-5 hover:text-gray-900">{campaign.title}</Link>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                campaign.status === "active"
                                  ? "bg-green-100 text-green-700"
                                  : campaign.status === "completed"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {campaign.status}
                            </span>
                          </div>
                          <button className="text-red-600 hover:text-red-800"
                                  onClick={()=>{handleclickClose(campaign.id)}}>
                            {campaign.status=="active" ? "close" : ""}
                          </button>
                        </div>
                        <div className="space-y-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>
                              ₹{campaign.amount_raised.toLocaleString()}
                            </span>
                            <span>{progress.toFixed(0)}%</span>
                            <span>
                              ₹{campaign.amount_raising.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {msg && (
                          <p className="text-sm text-green-600">{msg}</p>
                        )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No campaigns yet</p>
            )}
          </div>

          {/* Recent Posts */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Recent Updates</h2>
            {posts.length > 0 ? (
              <div className="space-y-4">
                {posts.slice(0, 3).map((post) => (
                  <div key={post.id} className="p-4 bg-purple-100 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-gray-800 line-clamp-2">{post.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No posts yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
