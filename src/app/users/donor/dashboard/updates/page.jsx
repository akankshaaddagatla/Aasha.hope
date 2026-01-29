// app/ngos/[id]/updates/page.jsx
"use server"

import { getNgoById } from '@/app/actions/ngo.actions'
import { getFollowedNGOsPosts } from '@/app/actions/posts.actions'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default async function AllUpdatesPage({params}) {
  const {id} = await params;
//   const {data : ngo, success} = await getNgoById(id)

//   if (!success) {
//     notFound()
//   }

  const { data : posts} = await getFollowedNGOsPosts()

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <Link
          href="/users/donor/dashboard"
          className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-6"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashbaord
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">All Updates from ngos followed by you</h1>

        {/* All Posts */}
        <div className="space-y-6">
          {posts.map((post) => (
            <article key={post.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                  {post.ngo_name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{post.ngo_name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(post.created_at).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              
              <p className="text-gray-800 mb-4 leading-relaxed whitespace-pre-line">
                {post.content}
              </p>
              
              {post.image_url && (
                <div className="relative h-96 rounded-lg overflow-hidden">
                  <Image
                    src={post.image_url}
                    alt="Post image"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

