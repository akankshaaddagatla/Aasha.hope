import React, { useState } from "react";
import { Heart, Users, Clock } from "lucide-react";

export default function NgoCard({ ngo }) {
  const [isHovered, setIsHovered] = useState(false);

  if (!ngo) {
    return <div className="bg-white rounded-xl shadow-lg p-6">No NGO data</div>;
  }

  const amountRaised = ngo.amount_raised || 0;
  const amountRaising = ngo.amount_raising || 1;

  const progressPercentage = Math.min(
    Math.round((amountRaised / amountRaising) * 100),
    100,
  );

  // Format currency with fallback
  const formatCurrency = (amount) => {
    const numAmount = Number(amount) || 0;
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(numAmount);
  };

  return (
    <div
      className="relative bg-white rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200 w-full max-w-sm mx-auto shadow-md flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section - Fixed Height */}
      <div className="relative h-90 flex-shrink-0">
        <img
          src={ngo.cover_image_url}
          alt={ngo.name}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

        <div className="absolute bottom-1 left-4 right-4 text-white">
          <h3 className="text-lg font-bold mb-1 line-clamp-2 h-12 overflow-hidden">
            {ngo.cause_statement}
          </h3>
        </div>

        <button className="absolute top-3 right-3 bg-white/90 hover:bg-gray-200 px-3 py-1.5 rounded-full text-sm font-medium text-gray-800 hover:text-black transition-colors duration-200 flex items-center gap-2 shadow-sm">
          Follow
        </button>

        <div className="absolute bottom-0 right-5 flex items-center gap-4 text-xs text-gray-200 mb-3">
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{formatCurrency(ngo.subscribers_count)} Followers</span>
          </div>
        </div>
      </div>

      {/* Content Section - Flexible but constrained */}
      <div className="p-4 flex flex-col min-h-0">
        {/* STATISTICS SECTION - Default View */}
        <div
          className={`transition-all duration-300 ${isHovered ? "opacity-0 max-h-0 overflow-hidden" : "opacity-100"}`}
        >
          <div className="flex justify-between items-center text-xs text-gray-700 mb-4">
            {/* Donations Count */}
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{formatCurrency(ngo.subscribers_count)} Donations</span>
            </div>

            {/* Raised and Goal - Close together */}
            <div className="flex items-baseline gap-1">
              <span className="font-medium text-red-700">
                ₹{formatCurrency(ngo.amount_raised)} raised
              </span>
              <span className="text-gray-500">of</span>
              <span className="font-medium text-gray-800">
                ₹{formatCurrency(ngo.amount_raising)}
              </span>
            </div>
          </div>

          <div className="p-1 border-t border-gray-100 flex-shrink-0">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-700 font-medium">Progress</span>
              <span className="text-gray-700 font-bold">
                {progressPercentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-amber-500 h-2 rounded-full transition-all duration-700"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS SECTION - Hover View */}
        <div
          className={`transition-all duration-300 ${isHovered ? "opacity-100" : "opacity-0 max-h-0 overflow-hidden"}`}
        >
          {/* Two Buttons Layout */}
          <div className="flex flex-row gap-3 h-full justify-center">
            <button className="w-full bg-red-700 hover:bg-red-800 text-white font-medium py-2 px-3 rounded-lg text-sm transition-colors duration-200 shadow-md hover:shadow-lg">
              Become a monthly supporter
            </button>
            <button className="w-full border-2 border-red-600 text-red-600 hover:bg-red-50 font-medium py-2 px-3 rounded-lg text-sm transition-colors duration-200">
              Donate now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
