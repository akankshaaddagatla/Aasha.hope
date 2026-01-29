'use client'

import { useState, useEffect } from 'react'
import { createCampaign } from '@/app/actions/campaign.actions'
import { getMyNGO } from '@/app/actions/ngo.actions'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CreateCampaignPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [ngo, setNGO] = useState(null)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    ngoId: '',
    title: '',
    description: '',
    causeStatement: '',
    campaignStory: '',
    coverImageUrl: '',
    amountRaising: '',
  })

  useEffect(() => {
    async function loadNGO() {
      const { ngo } = await getMyNGO()
      if (!ngo) {
        alert('Please register your NGO first')
        router.push('/users/ngo/dashboard/registerNgo')
      } else if (!ngo.is_verified) {
        alert('Your NGO must be verified before creating campaigns')
        router.push('/users/ngo/dashboard')
      } else {
        setNGO(ngo)
        formData.ngoId = ngo.id;
      }
    }
    loadNGO()
  }, [router])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!ngo) {
      setError('NGO not found')
      setLoading(false)
      return
    }

    const result = await createCampaign({
      ...formData,
      ngoId: ngo.id,
    })

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      alert('Campaign created successfully! Waiting for admin approval.')
      router.push('/users/ngo/dashboard')
    }
  }

  if (!ngo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/users/ngo/dashboard"
            className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Create New Campaign</h1>
          <p className="text-gray-600 mt-2">
            Create a fundraising campaign for <strong>{ngo.name}</strong>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Campaign Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Build 10 Smart Classrooms in Rural Schools"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief overview of the campaign (2-3 sentences)"
            />
          </div>

          <div>
            <label htmlFor="causeStatement" className="block text-sm font-medium text-gray-700 mb-2">
              Mission Statement <span className="text-red-500">*</span>
            </label>
            <textarea
              id="causeStatement"
              name="causeStatement"
              required
              rows={2}
              value={formData.causeStatement}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Mission in single sentence."
            />
          </div>

          {/* Detailed Story */}
          <div>
            <label htmlFor="camapignStory" className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Story <span className="text-red-500">*</span>
            </label>
            <textarea
              id="camapaignStory"
              name="campaignStory"
              required
              rows={6}
              value={formData.campaignStory}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tell the complete story... Why is this campaign important? Who will benefit? What impact will it create?"
            />
          </div>

          {/* Cover Image URL */}
          <div>
            <label htmlFor="coverImageUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Cover Image URL
            </label>
            <input
              type="url"
              id="coverImageUrl"
              name="coverImageUrl"
              value={formData.coverImageUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/campaign-image.jpg"
            />
          </div>

          {/* Fundraising Goal */}
          <div>
            <label htmlFor="amountRaising" className="block text-sm font-medium text-gray-700 mb-2">
              Fundraising Goal (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="amountRaising"
              name="amountRaising"
              required
              min="1000"
              value={formData.amountRaising}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 2500000"
            />
            <p className="text-sm text-gray-500 mt-1">
              How much money do you need to raise for this campaign?
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Campaign'}
            </button>
            <Link
              href="/users/ngo/dashboard"
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
            >
              Cancel
            </Link>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Your campaign will be reviewed by our admin team before going live. 
              This usually takes 24-48 hours.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}