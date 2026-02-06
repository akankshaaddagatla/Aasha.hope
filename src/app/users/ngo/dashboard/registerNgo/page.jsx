'use client'

import { useState, useEffect } from 'react'
import { createNGO } from '@/app/actions/ngo.actions'
import { redirect, useRouter } from 'next/navigation'
import { getUser } from '@/app/actions/auth.actions'
import Link from 'next/link'

export default function RegisterNGOPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    causeStatement: '',
    coverImageUrl: '',
    logoUrl: '',
    amountRaising: '',
  })

  const getuser = async ()=>{
    const {data : user} = await getUser();
    if(!user || user.role != "ngo"){
      redirect('/auth/signup')
    }
  }

  useEffect(()=>{
    getuser()
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    const result = await createNGO(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setMessage('NGO registered successfully! Waiting for admin approval.')
      router.push('/users/ngo/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        {message && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded">
              {message}
            </div>
          )}
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
          <h1 className="text-3xl font-bold text-gray-900">Register Your NGO</h1>
          <p className="text-gray-600 mt-2">
            Fill in the details below. Your NGO will be reviewed by our admin team before going live.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* NGO Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              NGO Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Hope Foundation India"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
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
              placeholder="Describe your NGO's mission, short sentence."
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.description.length} characters
            </p>
          </div>

          {/* Mission Statement */}
          <div>
            <label htmlFor="causeStatement" className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={5}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief description of your NGO."
            />
            <p className="text-sm text-gray-500 mt-1">
              Explain what your NGO does and the impact you create
            </p>
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
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-sm text-gray-500 mt-1">
              Optional: Add a cover image URL (use Unsplash or Imgur)
            </p>
          </div>

          {/* Logo URL */}
          <div>
            <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Logo URL
            </label>
            <input
              type="url"
              id="logoUrl"
              name="logoUrl"
              value={formData.logoUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-sm text-gray-500 mt-1">
              Optional: Add a cover image URL (use Unsplash or Imgur)
            </p>
          </div>

          {/* Fundraising Goal */}
          <div>
            <label htmlFor="amountRaising" className="block text-sm font-medium text-gray-700 mb-2">
              Annual Fundraising Goal (₹)
            </label>
            <input
              type="number"
              id="amountRaising"
              name="amountRaising"
              min="0"
              value={formData.amountRaising}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 5000000"
            />
            <p className="text-sm text-gray-500 mt-1">
              Your annual fundraising target
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Register NGO'}
            </button>
            <Link
              href="/users/ngo/dashboard"
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
            >
              Cancel
            </Link>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> After submission, your NGO will be reviewed by our admin team. 
              You'll be notified once it's approved and goes live on the platform.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}