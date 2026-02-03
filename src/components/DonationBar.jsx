"use client";
import Link from "next/link";

export default function DonationBar(data) {
  const { ngoId, ngoName, campaignId, campaignTitle } = data;
  console.log(ngoId)
  console.log(campaignId)
  return (
    <div className="fixed bottom-1 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl z-50">
        <div className="bg-red-100 rounded-xl shadow-2xl px-6 py-4 flex items-center justify-between">
      <div>
        <p className="text-xs text-gray-500">{ngoId ? "NGO" : "Campaign"}</p>
        <h1 className="text-xl font-semibold text-gray-900">Donate to {ngoId ? ngoName : campaignTitle}</h1>
      </div>
      <div>
        {ngoId ? (
          <Link
            className="w-full bg-red-500 hover:bg-red-700 text-white text-center font-medium py-2 px-3 rounded-lg text-sm transition-colors duration-200 shadow-md hover:shadow-lg"
            href={`/donation?ngoId=${ngoId}&ngoName=${ngoName}`}
          >
            Donate Now
          </Link>
        ) : (
          <Link
            className="w-full bg-red-700 hover:bg-red-800 text-white text-center font-medium py-2 px-3 rounded-lg text-sm transition-colors duration-200 shadow-md hover:shadow-lg"
            href={`/donation?campaignId=${campaignId}&campaignTitle=${campaignTitle}`}
          >
            Donate Now
          </Link>
        )}
      </div>
    </div>
    </div>
  );
}
