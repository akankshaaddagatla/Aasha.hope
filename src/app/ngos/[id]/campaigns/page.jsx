// app/ngos/[id]/campaigns/page.jsx
"use server"

import { getNgoById } from '@/app/actions/ngo.actions'
import { getCampaignsByNGO } from '@/app/actions/campaign.actions'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default async function AllCampaignsPage({params}) {
  const {id} = await params;
  const {data : ngo, success} = await getNgoById(id)

  if (!success) {
    notFound()
  }

  const {data : campaigns} = await getCampaignsByNGO(id)
  const activeCampaigns = campaigns.filter(c => c.status === 'active')

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <Link
          href={`/ngos/${id}`}
          className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-6"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to {ngo.name}
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          All Campaigns from {ngo.name}
        </h1>

        {/* All Campaigns Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeCampaigns.map((campaign) => {
            const progress = (campaign.amount_raised / campaign.amount_raising) * 100
            return (
              <Link
                key={campaign.id}
                href={`/campaigns/${campaign.id}`}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-orange-300 transition-all group"
              >
                {campaign.cover_image_url && (
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={campaign.cover_image_url}
                      alt={campaign.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                    {campaign.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {campaign.description}
                  </p>
                  <div className="space-y-3">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-orange-500 to-red-600 h-3 rounded-full"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        ₹{campaign.amount_raised.toLocaleString()}
                      </span>
                      <span className="font-bold text-orange-600">
                        {progress.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
