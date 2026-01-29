"use server"
import { createClient } from "@/lib/supabase/server"
import { LucideDatabaseZap } from "lucide-react"
import { revalidatePath } from "next/cache"

// Get posts by NGO
export async function getPostsByNGO(ngoId, limit = 10) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      users (
        name,
        email
      )
    `)
    .eq('ngo_id', ngoId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    return { posts: [] }
  }

  return { data: data || [] }
}

/**
 * Get feed posts from followed NGOs
 */
export async function getFollowedNGOsPosts() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { posts: [] }
  }

  // Get followed NGO IDs
  const { data: follows } = await supabase
    .from('follows')
    .select('ngo_id')
    .eq('user_id', user.id)

  if (!follows || follows.length === 0) {
    return { posts: [] }
  }

  const ngoIds = follows.map(f => f.ngo_id)

  // Get posts from followed NGOs
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      ngos (
        id,
        name,
        cover_image_url
      ),
      users (
        name
      )
    `)
    .in('ngo_id', ngoIds)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    return { posts: [] }
  }

  return { data: data || [] }
}

/**
 * Create new post (for NGO admin)
 */
export async function createPost(formData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in' }
  }

  // Verify user owns the NGO
  const { data: ngo } = await supabase
    .from('ngos')
    .select('owner_id')
    .eq('id', formData.ngoId)
    .maybeSingle()

  if (!ngo || ngo.owner_id !== user.id) {
    return { error: 'You can only post updates for your own NGO' }
  }

  const { data, error } = await supabase
    .from('posts')
    .insert({
      ngo_id: formData.ngoId,
      ngo_name: formData.ngoName,
      posted_by: user.id,
      content: formData.content,
      image_url: formData.imageUrl,
    })
    .select()
    .single()

  if (error) {
    return { error: 'Failed to create post' }
  }

  revalidatePath(`/ngos/${formData.ngoId}`)
  return { success: true, data: data }
}

/**
 * Delete post
 */
export async function deletePost(postId) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in' }
  }

  // Verify ownership
  const { data: post } = await supabase
    .from('posts')
    .select('posted_by, ngo_id')
    .eq('id', postId)
    .maybeSingle()

  if (!post || post.posted_by !== user.id) {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)

  if (error) {
    return { error: 'Failed to delete post' }
  }

  revalidatePath(`/ngos/${post.ngo_id}`)
  return { success: true }
}