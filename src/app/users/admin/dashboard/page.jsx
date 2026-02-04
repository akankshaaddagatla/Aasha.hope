"use client"

import { getUser } from '@/app/actions/users.actions'
import { redirect } from 'next/navigation'
import { VerifyNGOButton } from '@/components/VerifyNgoButton'
import { VerifyCampaignButton } from '@/components/VerifyCampaignButton'
import { getPendingCampaigns, getPendingNGOs, getAllDonations} from '@/app/actions/admin.actions'
import { getVerifiedCampaigns } from '@/app/actions/campaign.actions'
import { getVerifiedNgos } from '@/app/actions/ngo.actions'
import { getAllUsers, getUserById } from '@/app/actions/users.actions'
import { useEffect, useState } from 'react'
import Image from 'next/image'

async function checkAdminAuth() {
  const { data: user } = await getUser()

  if (!user) {
    redirect('/login');
  }

  const { data: userData } = await getUserById(user.id)

  if (userData?.role !== 'admin') {
    redirect('/')
  }

  return { user, userData }
}

async function getAdminStats() {
  // Get all NGOs
  const { data: allNGOs } = await getVerifiedNgos()
  const { data: pendingNGOs } = await getPendingNGOs()
  
  // Get all campaigns
  const { data: allCampaigns } = await getVerifiedCampaigns()
  const { data: pendingCampaigns } = await getPendingCampaigns()
  
  // Get all users
  const { data: users } = await getAllUsers()
  
  // Get all donations
  const { data: donations } = await getAllDonations();
  const totalRaised = donations?.reduce((sum, d) => sum + Number(d.amount), 0) || 0
  
  return {
    totalNGOs: allNGOs?.length || 0,
    pendingNGOs: pendingNGOs?.length || 0,
    totalCampaigns: allCampaigns?.length || 0,
    pendingCampaigns: pendingCampaigns?.length || 0,
    totalUsers: users?.length || 0,
    totalRaised,
    pendingNGOsList: pendingNGOs || [],
    pendingCampaignsList: pendingCampaigns || []
  }
}

export default function AdminDashboard() {
  const [userData, setUserData] = useState([]);
  const [stats, setStats] = useState([]);

  const initialData = async () =>{
    const { userData } = await checkAdminAuth()
    setUserData(userData)
    const stats = await getAdminStats()
    setStats(stats);
  }
  
  useEffect(()=>{
    initialData()
  },[])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">Platform Admin Dashboard</h1>
          <p className="text-red-100">Manage NGOs, Campaigns & Users</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <p className="text-sm text-gray-600 mb-1">Total NGOs</p>
            <p className="text-3xl font-bold">{stats.totalNGOs}</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <p className="text-sm text-gray-600 mb-1">Pending NGOs</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.pendingNGOs}</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <p className="text-sm text-gray-600 mb-1">Total Campaigns</p>
            <p className="text-3xl font-bold">{stats.totalCampaigns}</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <p className="text-sm text-gray-600 mb-1">Pending Campaigns</p>
            <p className="text-3xl font-bold text-orange-600">{stats.pendingCampaigns}</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <p className="text-sm text-gray-600 mb-1">Total Raised</p>
            <p className="text-2xl font-bold">₹{stats.totalRaised?.toLocaleString()}</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500">
            <p className="text-sm text-gray-600 mb-1">Total Users</p>
            <p className="text-3xl font-bold">{stats.totalUsers}</p>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Pending NGOs */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center justify-between">
              <span>Pending NGO Verifications</span>
              <span className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-bold">
                {stats.pendingNGOs}
              </span>
            </h2>
            {stats.pendingNGOsList?.length > 0 ? (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {stats.pendingNGOsList.map((ngo) => (
                  <div key={ngo.id} className="border-2 border-yellow-200 rounded-lg p-4 bg-yellow-50">
                    <div className="flex items-start gap-3 mb-3">
                      {ngo.logo_url && (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <Image src={ngo.logo_url} alt={ngo.name} fill className="object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg mb-1">{ngo.name}</h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{ngo.description}</p>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            Applied: {new Date(ngo.created_at).toLocaleDateString()}
                          </span>
                          {ngo.users && (
                            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
                              Owner: {ngo.users.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {ngo.cause_statement && (
                      <div className="mb-3 p-3 bg-white rounded border border-yellow-200">
                        <p className="text-xs font-semibold text-gray-700 mb-1">Mission Statement</p>
                        <p className="text-sm text-gray-600">{ngo.cause_statement}</p>
                      </div>
                    )}

                    <VerifyNGOButton ngoId={ngo.id} ngoName={ngo.name} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-500 font-medium">No pending NGO verifications</p>
                <p className="text-sm text-gray-400 mt-1">All NGOs have been reviewed</p>
              </div>
            )}
          </div>

          {/* Pending Campaigns */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center justify-between">
              <span>Pending Campaign Verifications</span>
              <span className="text-sm bg-orange-100 text-orange-800 px-3 py-1 rounded-full font-bold">
                {stats.pendingCampaigns}
              </span>
            </h2>
            {stats.pendingCampaignsList?.length > 0 ? (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {stats.pendingCampaignsList.map((campaign) => (
                  <div key={campaign.id} className="border-2 border-orange-200 rounded-lg p-4 bg-orange-50">
                    <div className="flex items-start gap-3 mb-3">
                      {campaign.cover_image_url && (
                        <div className="relative w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <Image src={campaign.cover_image_url} alt={campaign.title} fill className="object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg mb-1">{campaign.title}</h3>
                        <div className="flex flex-wrap gap-2 text-xs mb-2">
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-semibold">
                            Goal : ₹{campaign.amount_raising.toLocaleString()}
                          </span>
                          {campaign.ngos && (
                            <span className={`px-2 py-1 rounded font-semibold ${
                              campaign.ngos.verification_status == 'verified' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-red-100 text-red-700'
                            }`}>
                              NGO : {campaign.ngos.name} {campaign.ngos.verification_status=='verified' ? '✓' : '✗'}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{campaign.description}</p>
                      </div>
                    </div>

                    {campaign.cause_statement && (
                      <div className="mb-3 p-3 bg-white rounded border border-orange-200">
                        <p className="text-xs font-semibold text-gray-700 mb-1">Campaign Mission</p>
                        <p className="text-sm text-gray-600">{campaign.cause_statement}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-2 mb-3 text-xs">
                      <span className="text-gray-500">
                        Created: {new Date(campaign.created_at).toLocaleDateString()}
                      </span>
                      {campaign.users && (
                        <span className="text-gray-500">
                          By: {campaign.users.name}
                        </span>
                      )}
                    </div>

                    <VerifyCampaignButton 
                      campaignId={campaign.id} 
                      campaignTitle={campaign.title}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-500 font-medium">No pending campaign verifications</p>
                <p className="text-sm text-gray-400 mt-1">All campaigns have been reviewed</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}