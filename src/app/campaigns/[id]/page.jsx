"use client";

import { getCampaignById } from "@/app/actions/campaign.actions";
import { notFound } from "next/navigation";
import Image from "next/image";
import { useEffect,useState } from "react";
import DonationBar from "@/components/DonationBar";

export default function NGOPage({ params }) {
  const [campaign, setCampaign] = useState([]);

  const getData = async () => {
    const { id } = await params;
    const { data: campaign, success } = await getCampaignById(id);
    if (!success) {
      notFound();
    }
    setCampaign(campaign)
  };

  useEffect(()=>{
    getData()
  },[])

  // Calculate progress percentage for goal
  const progressPercentage = campaign.amount_raising
    ? Math.min((campaign.amount_raised / campaign.amount_raising) * 100, 100)
    : 0;

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
       {/* Hero Section with Cover Image */}
      <div className="relative h-100 w-full bg-linear-to-br from-blue-600 via-purple-600 to-pink-500">
        {campaign.cover_image_url && (
          <Image
            src={campaign.cover_image_url}
            alt={campaign.title}
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
                <div className="relative w-40 h-40 rounded-2xl overflow-hidden border-4 border-white shadow-xl shrink-0 bg-white">
                  {campaign.logo_url ? (
                    <Image
                      src={campaign.logo_url}
                      alt={`${campaign.title} logo`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-blue-500 to-purple-600 text-white text-4xl font-bold">
                      {campaign.title?.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
                        {campaign.title}
                      </h1>
                      {campaign.is_verified && (
                        <div className="inline-flex items-center gap-2 bg-linear-to-r from-blue-50 to-blue-100 text-blue-700 px-4 py-2 rounded-full border border-blue-200">
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
                          <span className="font-semibold">Verified Campaign</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-lg text-gray-600 leading-relaxed mb-6">
                    {campaign.description}
                  </p>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-linear-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
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
                        <span className="text-xs font-medium text-green-700 uppercase">
                          Raised
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-green-900">
                        ₹{(campaign.amount_raised || 0).toLocaleString()}
                      </p>
                    </div>

                    <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                      <div className="flex items-center gap-2 mb-1">
                        <svg
                          className="w-5 h-5 text-purple-600"
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
                        <span className="text-xs font-medium text-purple-700 uppercase">
                          Donations
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-purple-900">
                        {(campaign.total_donations || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cause Statement */}
              {campaign.cause_statement && (
                <div className="mt-8 p-6 bg-linear-to-r from-blue-50 via-purple-50 to-pink-50 rounded-xl border-l-4 border-blue-500">
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
                        {campaign.cause_statement}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Fundraising Progress (if applicable) */}
              {campaign.amount_raising > 0 && (
                <div className="mt-8 p-6 bg-linear-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-lg text-gray-900">
                      Fundraising Goal
                    </h3>
                    <span className="text-sm font-semibold text-green-700">
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
                        ₹{campaign.amount_raised.toLocaleString()}
                      </span>
                    </span>
                    <span className="text-gray-600">
                      Goal:{" "}
                      <span className="font-bold text-gray-900">
                        ₹{campaign.amount_raising.toLocaleString()}
                      </span>
                    </span>
                  </div>
                </div>
              )}

              {campaign.campaign_story && (
                <div className="mt-8 p-6 bg-linear-to-r from-blue-50 via-purple-50 to-pink-50 rounded-xl border-l-4 border-blue-500">
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
                        Our Story
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {campaign.campaign_story}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="">
         <DonationBar camoaignId={campaign.id} campaignTitle={campaign.title}/>
      </div>
    </div>
  );
}
