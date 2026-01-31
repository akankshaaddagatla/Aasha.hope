'use client'

import { useState } from 'react'
import { verifyNGO, testDirectUpdate} from '@/app/actions/admin.actions'

export function VerifyNGOButton({ ngoId, ngoName }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleVerify = async () => {
    if (!confirm(`Are you sure you want to VERIFY "${ngoName}"?`)) {
      return
    }

    setLoading(true)
    setMessage('')

    const result = await verifyNGO(ngoId)
    console.log(result)

    if (result.error) {
      setMessage(result.error)
    } else {
      setMessage(result.message)
      // Refresh the page after 1 second
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    }

    setLoading(false)
  }

//   const handleReject = async () => {
//     if (!confirm(`Are you sure you want to REJECT "${ngoName}"? This action cannot be undone.`)) {
//       return
//     }

//     setLoading(true)
//     setMessage('')

//     const result = await rejectNGO(ngoId)

//     if (result.error) {
//       setMessage(result.error)
//     } else {
//       setMessage(result.message)
//       setTimeout(() => {
//         window.location.reload()
//       }, 1000)
//     }

//     setLoading(false)
//   }

  return (
    <div>
      <div className="flex gap-2">
        <button
          onClick={handleVerify}
          disabled={loading}
          className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processing...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Verify
            </>
          )}
        </button>

        {/* <button
          onClick={handleReject}
          disabled={loading}
          className="px-4 py-2 border-2 border-red-300 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Reject
        </button> */}

      </div>

      {message && (
        <p className={`mt-2 text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </div>
  )
}