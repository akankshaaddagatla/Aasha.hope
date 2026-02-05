"use client";
import Link from "next/link";

export default function DonationBar(data) {
  const { ngoId, ngoName, campaignId, campaignTitle } = data;
  console.log(ngoId)
  console.log(campaignId)
  return (
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl z-50 shadow-xl">
        <div className="bg-white border border-emerald-100 rounded-xl shadow-2xl px-9 py-7 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{ngoId ? "NGO" : "Campaign"}</p>
        <h1 className="text-xl font-semibold text-gray-900">Donate to {ngoId ? ngoName : campaignTitle}</h1>
      </div>
      <div>
        {ngoId ? (
          <Link
            className="w-full bg-green-700 hover:bg-green-800 text-white text-center font-bold py-5 px-6 rounded-xl text-lg shadow-md hover:shadow-lg transition-colors duration-200"
            href={`/donation?ngoId=${ngoId}&ngoName=${ngoName}`}
          >
            Donate Now
          </Link>
        ) : (
          <Link
            className="w-full bg-green-700 hover:bg-green-800 text-white text-center font-bold py-5 px-6 rounded-xl text-lg shadow-md hover:shadow-lg transition-colors duration-200"
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
