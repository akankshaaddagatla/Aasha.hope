"use client";

import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import { getFollowedNGOs } from "@/app/actions/follow.actions";
import {
  getSuccessfulDonations,
  getTotalDonated,
} from "@/app/actions/donation.actions";
import { getFollowedNGOsPosts } from "@/app/actions/posts.actions";
import { getUser, getUserById } from "@/app/actions/users.actions";
import {
  getCampaignsByUser,
  closeCampaign,
} from "@/app/actions/campaign.actions";
import Image from "next/image";
import Link from "next/link";

export default function DonorDashboard() {
  const [campaigns, setCampaigns] = useState([]);
  const [followedNGOs, setFollowedNGOs] = useState([]);
  const [donations, setDonations] = useState([]);
  const [totalDonated, setTotalDonated] = useState([]);
  const [feedPosts, setFeedPosts] = useState([]);
  const [latestPost, setLatestPost] = useState([]);
  const [userData, setuserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    async function init() {
      try {
        const { data: user } = await getUser();

        if (!user) {
          redirect("/login");
        }

        const { data: userData } = await getUserById(user.id);

        if (userData?.role !== "donor") {
          redirect("/");
        }

        const { data: campaigns } = await getCampaignsByUser();
        const { data: followedNGOs } = await getFollowedNGOs();
        const { data: donations } = await getSuccessfulDonations();
        const { data: totalDonated } = await getTotalDonated();
        const { data: feedPosts } = await getFollowedNGOsPosts();
        const latestPost =
          feedPosts && feedPosts.length > 0 ? feedPosts[0] : null;
        setCampaigns(campaigns);
        setFollowedNGOs(followedNGOs);
        setDonations(donations);
        setTotalDonated(totalDonated);
        setFeedPosts(feedPosts);
        setLatestPost(latestPost);
        setuserData(userData);
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  const handleclickClose = async (id) => {
    const { error } = await closeCampaign(id);
    if (error) {
      setMsg("Could'nt close campaign");
    }

    setMsg("Campaign Closed");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Fixed gradient class */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {userData.name}!
          </h1>
          <p className="text-blue-100">Your impact dashboard</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Donated</p>
                <p className="text-3xl font-bold text-gray-900">
                  ₹{totalDonated?.toLocaleString() || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Following</p>
                <p className="text-3xl font-bold text-gray-900">
                  {followedNGOs?.length || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">NGOs</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Donations Made</p>
                <p className="text-3xl font-bold text-gray-900">
                  {donations?.length || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Total contributions
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Updates Feed */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
                Updates from NGOs you follow
              </h2>
              {latestPost ? (
                <div className="space-y-6">
                  <article className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                        {latestPost.ngo_name?.charAt(0) || "N"}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {latestPost.ngo_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(latestPost.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-800 mb-4 leading-relaxed whitespace-pre-line">
                      {latestPost.content}
                    </p>

                    {latestPost.image_url && (
                      <div className="relative h-96 rounded-lg overflow-hidden">
                        <Image
                          src={latestPost.image_url}
                          alt="Post image"
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                  </article>

                  {/* View All Updates Button */}
                  {feedPosts?.length > 1 && (
                    <Link
                      href="/users/donor/dashboard/updates"
                      className="block w-full py-3 px-6 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center"
                    >
                      View All Updates ({feedPosts.length})
                    </Link>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Follow NGOs to see their updates here
                </p>
              )}
            </div>

            {/* Recent Donations */}
            <div className="bg-white rounded-xl shadow-lg p-6">
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
                <p className="text-gray-500 text-center py-8">
                  No donations yet
                </p>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Following NGOs */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">Following</h2>
              {followedNGOs && followedNGOs.length > 0 ? (
                <div className="space-y-3">
                  {followedNGOs.slice(0, 5).map((ngo) => (
                    <Link
                      key={ngo.id}
                      href={`/ngos/${ngo.id}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition"
                    >
                      <div className="w-12 h-12 rounded-full bg-blue-600 text-white overflow-hidden flex items-center justify-center text-lg font-bold">
                        {ngo.name?.charAt(0) || "N"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{ngo.name}</p>
                        <p className="text-sm text-gray-500">
                          {ngo.followers_count || 0} followers
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">
                  Not following any NGOs yet
                </p>
              )}
              <Link
                href="/ngos"
                className="block mt-4 text-center text-blue-600 hover:text-blue-700 font-semibold"
              >
                Discover NGOs →
              </Link>
            </div>

            {/* Your Campaigns */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">Your Campaigns</h2>
              {campaigns && campaigns.length > 0 ? (
                <div className="space-y-4">
                  {campaigns.map((campaign) => {
                    const progress =
                      (campaign.amount_raised / campaign.amount_raising) * 100;
                    return (
                      <div
                        key={campaign.id}
                        className={`p-4 rounded-lg ${
                          campaign.verification_status == "verified"
                            ? "bg-green-100"
                            : campaign.verification_status == "rejected"
                              ? "bg-red-100"
                              : "bg-gray-100"
                        }`}
                      >
                        {msg && <p className="text-sm text-red-600">{msg}</p>}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex">
                            <Link
                              href={`/campaigns/${campaign.id}`}
                              className="font-semibold text-gray-700 mr-5 hover:text-gray-900"
                            >
                              {campaign.title}
                            </Link>
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
                          <button
                            className="text-red-600 hover:text-red-800"
                            onClick={() => {
                              handleclickClose(campaign.id);
                            }}
                          >
                            {campaign.status == "active" ? "close" : ""}
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
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No campaigns yet</p>
                  <Link
                    href="/createCampaign"
                    className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Start a Campaign
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
