'use client'

import { useState, useEffect, useTransition } from 'react'
import { followNGO, unfollowNGO, checkIfFollowing } from '@/app/actions/follow.actions'
import { useRouter } from 'next/navigation'

export default function FollowButton({ ngoId, initialFollowing = false, setFollowerCount }) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  useEffect(() => {
    const checkStatus = async () => {
      const result = await checkIfFollowing(ngoId)
      setIsFollowing(result.data)
    }
    checkStatus()
  }, [ngoId])

  const handleToggleFollow = async () => {
    setError('')

    startTransition(async () => {
      if (isFollowing) {
        // Unfollow
        const result = await unfollowNGO(ngoId)
        
        if (result?.error) {
          setError(result.error)
        } else {
          setIsFollowing(false)
          setFollowerCount((prev) => prev-1)
        }
      } else {
        // Follow
        const result = await followNGO(ngoId)
        
        if (result?.error) {
          setError(result.error)
          if (result.error.includes('logged in')) {
            router.push('/auth/login')
          }
        } else {
          setIsFollowing(true)
          setFollowerCount((prev) => prev+1)
        }
      }
    })
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleToggleFollow}
        disabled={isPending}
        className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
          isFollowing
            ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {isPending ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </>
        ) : isFollowing ? (
          <>
            Following
          </>
        ) : (
          <>
            Follow
          </>
        )}
      </button>

      {error && (
        <p className="text-sm text-red-600 text-center">{error}</p>
      )}
    </div>
  )
}

// Display follower count with icon
export function FollowStats({ followerCount }) {
  return (
    <div className="flex items-center gap-2 text-gray-600">
      <svg
        className="w-5 h-5"
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
      <span className="font-medium">
        {followerCount?.toLocaleString()} {followerCount === 1 ? 'Follower' : 'Followers'}
      </span></div>
  )
}