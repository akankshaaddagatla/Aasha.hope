'use client'

import { useState, useEffect } from 'react'
import { createPost } from '@/app/actions/posts.actions'
import { getMyNGO } from '@/app/actions/ngo.actions'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CreatePostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [ngo, setNGO] = useState(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    content: '',
    imageUrl: '',
  })

  useEffect(() => {
    async function loadNGO() {
      const { data : ngo } = await getMyNGO()
      if (!ngo) {
        setError('Please register your NGO first')
        router.push('/users/ngo/dashboard/registerNgo')
      } else if (ngo.verification_status != 'verified') {
        setError('Your NGO must be verified before posting updates')
        router.push('/users/ngo/dashboard')
      } else {
        setNGO(ngo)
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
    setMessage>('')
    setLoading(true)

    if (!ngo) {
      setError('NGO not found')
      setLoading(false)
      return
    }

    const result = await createPost({
      ngoId: ngo.id,
      ngoName: ngo.name,
      content: formData.content,
      imageUrl: formData.imageUrl,
    })

    if (result?.error) {
      console.log(result.error)
      setError(result.error)
      setLoading(false)
    } else {
      setMessage('Post created successfully!')
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
          <h1 className="text-3xl font-bold text-gray-900">Post an Update</h1>
          <p className="text-gray-600 mt-2">
            Share news and updates with your followers
          </p>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Preview</h2>
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {ngo.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold">{ngo.name}</p>
                <p className="text-sm text-gray-500">Just now</p>
              </div>
            </div>
            <p className="text-gray-800 whitespace-pre-line mb-4">
              {formData.content || 'Your post content will appear here...'}
            </p>
            {formData.imageUrl && (
              <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={formData.imageUrl}
                  alt="Post preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = ''
                    e.target.alt = 'Invalid image URL'
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-red-50 border border-red-200 text-green-800 px-4 py-3 rounded">
              {message}
            </div>
          )}

          {/* Post Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              What's new with your NGO? <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              required
              rows={8}
              value={formData.content}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Share updates about your projects, success stories, events, achievements, or calls for volunteers..."
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.content.length} characters
            </p>
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Add an Image (Optional)
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/photo.jpg"
            />
            <p className="text-sm text-gray-500 mt-1">
              Add a photo to make your post more engaging
            </p>
          </div>

          {/* Tips Box */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-green-800 mb-2">💡 Tips for great posts:</p>
            <ul className="text-sm text-green-700 space-y-1 ml-4 list-disc">
              <li>Share specific impact numbers (e.g., "Helped 200 children this month")</li>
              <li>Include photos of your work in action</li>
              <li>Tell stories about the people you've helped</li>
              <li>Update followers on campaign progress</li>
              <li>Announce upcoming events or volunteer opportunities</li>
            </ul>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading || !formData.content.trim()}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Posting...' : 'Post Update'}
            </button>
            <Link
              href="/users/ngo/dashboard"
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}