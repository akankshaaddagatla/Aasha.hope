"use client";

import { getNgoById } from "@/app/actions/ngo.actions";
import { getCampaignsByNGO } from "@/app/actions/campaign.actions";
import { getPostsByNGO } from "@/app/actions/posts.actions";
import { notFound } from "next/navigation";
import FollowButton from "@/components/FollowButton";
import { FollowStats } from "@/components/FollowButton";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { checkIfFollowing } from "@/app/actions/follow.actions";
import DonationBar from "@/components/DonationBar";

export default function NGOPage({ params }) {
  const [ngo, setNgo] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);

  const getData = async () => {
    const { id } = await params;
    const { data: ngo, success } = await getNgoById(id);
    if (!success) {
      notFound();
    }
    setNgo(ngo);
    const { data: campaigns } = await getCampaignsByNGO(id);
    setCampaigns(campaigns);
    const { data: posts } = await getPostsByNGO(id);
    setPosts(posts);
    const { data } = await checkIfFollowing(ngo.id);
    setIsFollowing(data);
    setFollowerCount(ngo.followers_count);
  };

  useEffect(() => {
    getData();
  }, []);

  // Get most recent post and campaign
  const latestPost = posts && posts.length > 0 ? posts[0] : null;
  const activeCampaigns = campaigns.filter((c) => c.status === "active");
  const latestCampaign = activeCampaigns.length > 0 ? activeCampaigns[0] : null;

  // Calculate progress percentage for goal
  const progressPercentage = ngo.amount_raising
    ? Math.min((ngo.amount_raised / ngo.amount_raising) * 100, 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section with Cover Image */}
      <div className="relative h-96 w-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
        {ngo.cover_image_url && (
          <Image
            src={ngo.cover_image_url}
            alt={ngo.name}
            fill
            className="object-cover"
            priority
          />
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* NGO Header Card */}
        <div className="relative -mt-32 mb-8">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-8 lg:p-12">
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Logo */}
                <div className="relative w-40 h-40 rounded-2xl overflow-hidden border-4 border-white shadow-xl flex-shrink-0 bg-white">
                  {ngo.logo_url ? (
                    <Image
                      src={ngo.logo_url}
                      alt={ngo.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white text-4xl font-bold">
                      {ngo.name?.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
                        {ngo.name}
                      </h1>
                      {ngo.verification_status == 'verified' && (
                        <div className="inline-flex items-center gap-2 bg-gray-50 text-blue-700 px-4 py-2 rounded-full shadow-sm">
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="font-semibold">Verified NGO</span>
                        </div>
                      )}
                    </div>

                    {/* Follow Button */}
                    <div className="flex items-center gap-4 shrink-0">
                      <FollowStats followerCount={followerCount} />
                      <FollowButton
                        ngoId={ngo.id}
                        initialFollowing={isFollowing}
                        setFollowerCount={setFollowerCount}
                      />
                    </div>
                  </div>

                  <p className="text-lg text-gray-600 leading-relaxed mb-6">
                    {ngo.description}
                  </p>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-blue-500 shadow-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <svg
                          className="w-5 h-5 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        <span className="text-xs font-medium text-blue-600 uppercase">
                          Followers
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-blue-700">
                        {(ngo.followers_count || 0).toLocaleString()}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 border-l-4 shadow-sm border-green-500">
                      <div className="flex items-center gap-2 mb-1">
                        <svg
                          className="w-5 h-5 text-green-600"
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
                        <span className="text-xs font-medium text-green-600 uppercase">
                          Raised
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-green-700">
                        ₹{(ngo.amount_raised || 0).toLocaleString()}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-blue-500 shadow-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <svg
                          className="w-5 h-5 text-blue-600"
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
                        <span className="text-xs font-medium text-blue-600 uppercase">
                          Donations
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-blue-700">
                        {(ngo.total_donations || 0).toLocaleString()}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-blue-500 shadow-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <svg
                          className="w-5 h-5 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                          />
                        </svg>
                        <span className="text-xs font-medium text-blue-600 uppercase">
                          Campaigns
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-blue-700">
                        {activeCampaigns.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cause Statement */}
              {ngo.cause_statement && (
                <div className="mt-8 p-6 bg-gray-50 rounded-xl border-l-4 border-blue-500 shadow-sm">
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-blue-600 shrink-0 mt-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-2">
                        Our Mission
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {ngo.cause_statement}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Fundraising Progress (if applicable) */}
              {ngo.amount_raising > 0 && (
                <div className="mt-8 p-6 bg-gray-50 rounded-xl border-l-4 border-green-500 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-lg text-gray-900">
                      Annual Fundraising Goal
                    </h3>
                    <span className="text-sm font-semibold text-green-600">
                      {progressPercentage.toFixed(0)}% Complete
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-3 overflow-hidden">
                    <div
                      className="bg-linear-to-r from-green-500 to-emerald-600 h-4 rounded-full transition-all duration-500 shadow-lg"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Raised:{" "}
                      <span className="font-bold text-gray-900">
                        ₹{ngo.amount_raised.toLocaleString()}
                      </span>
                    </span>
                    <span className="text-gray-600">
                      Goal:{" "}
                      <span className="font-bold text-gray-900">
                        ₹{ngo.amount_raising.toLocaleString()}
                      </span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="grid lg:grid-cols-3 gap-8 pb-16">
          {/* Main Content - Latest Update */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-blue-500 p-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Latest Update
                </h2>
              </div>

              <div className="p-6">
                {latestPost ? (
                  <div className="space-y-6">
                    <article className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                          {ngo.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {ngo.name}
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
                    {posts.length > 1 && (
                      <Link
                        href={`/ngos/${ngo.id}/updates`}
                        className="block w-full py-3 px-6 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center"
                      >
                        View All Updates ({posts.length})
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg
                      className="w-16 h-16 text-gray-300 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2"
                      />
                    </svg>
                    <p className="text-gray-500 text-lg">No updates yet</p>
                    <p className="text-gray-400 text-sm mt-2">
                      Check back soon for news from {ngo.name}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Latest Campaign */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-6">
              <div className="bg-blue-500 p-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  Active Campaigns
                </h2>
              </div>

              <div className="p-6">
                {latestCampaign ? (
                  <div className="space-y-4">
                    <Link
                      href={`/campaigns/${latestCampaign.id}`}
                      className="block shadow-sm rounded-xl overflow-hidden hover:shadow-lg transition-all group"
                    >
                      {latestCampaign.cover_image_url && (
                        <div className="relative h-32 overflow-hidden">
                          <Image
                            src={latestCampaign.cover_image_url}
                            alt={latestCampaign.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                          {latestCampaign.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {latestCampaign.description}
                        </p>
                        <div className="space-y-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{
                                width: `${Math.min((latestCampaign.amount_raised / latestCampaign.amount_raising) * 100, 100)}%`,
                              }}
                            />
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">
                              ₹{latestCampaign.amount_raised.toLocaleString()}
                            </span>
                            <span className="font-semibold text-green-600">
                              {(
                                (latestCampaign.amount_raised /
                                  latestCampaign.amount_raising) *
                                100
                              ).toFixed(0)}
                              %
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>

                    {/* View All Campaigns Button */}
                    {activeCampaigns.length > 1 && (
                      <Link
                        href={`/ngos/${ngo.id}/campaigns`}
                        className="block w-full py-3 px-6 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center"
                      >
                        View All Campaigns ({activeCampaigns.length})
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg
                      className="w-12 h-12 text-gray-300 mx-auto mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                    <p className="text-gray-500">No active campaigns</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="">
        <DonationBar ngoId={ngo.id} ngoName={ngo.name} />
      </div>
    </div>
  );
}
