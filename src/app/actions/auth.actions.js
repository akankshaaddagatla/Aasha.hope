// app/actions/auth.actions.js
'use server'
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function signUp(formData) {
  const supabase = await createClient()

  const { email, password, name, role = 'donor' } = formData

  // Validate inputs
  if (!email || !password || !name) {
    return { error: 'All fields are required' }
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters' }
  }

  // Sign up with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name,
        role: role,
      },
    },
  })

  if (authError) {
    return { error: authError.message }
  }

  // Create user profile in users table
  if (authData.user) {
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: email,
        name: name,
        role: role,
      })

    if (profileError) {
      return { error: 'Failed to create user profile' }
    }
  }

  return { 
    success: true, 
    message: 'Please check your email to verify your account' 
  }
}

export async function signIn(formData) {
  const supabase = await createClient()

  const { email, password } = formData

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Redirect based on user role
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', data.user.id)
    .single()

  revalidatePath('/', 'layout')
  
  if (userData?.role === 'ngo') {
    redirect('/users/ngo/dashboard')
  } else if(userData?.role === 'admin'){
    redirect('/users/admin/dashboard')
  }else{
    redirect('/users/donor/dashboard')
  }
}

export async function signOut() {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function getUser() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { user: null }
  }

  // Get user profile data
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profileError) {
    return { user: null }
  }

  return { 
    user: {
      ...user,
      profile,
    }
  }
}


export async function updateProfile(updates) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/profile')
  return { success: true }
}

export async function resetPassword(email) {
  const supabase = await createClient()

  if (!email) {
    return { error: 'Email is required' }
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { 
    success: true, 
    message: 'Password reset link sent to your email' 
  }
}

export async function updatePassword(newPassword) {
  const supabase = await createClient()

  if (!newPassword || newPassword.length < 8) {
    return { error: 'Password must be at least 8 characters' }
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true, message: 'Password updated successfully' }
}


export async function checkRole(requiredRole) {
  const { user } = await getUser()

  if (!user?.profile?.role) {
    return false
  }

  return user.profile.role === requiredRole
}


export async function getFollowedNGOs() {
  const supabase = await createClient()
  const { user } = await getUser()

  if (!user) {
    return { ngos: [] }
  }

  const { data, error } = await supabase
    .from('ngo_followers')
    .select(`
      ngo_id,
      ngos (
        id,
        name,
        logo_url,
        description,
        category
      )
    `)
    .eq('user_id', user.id)

  if (error) {
    return { ngos: [] }
  }

  return { ngos: data.map(item => item.ngos) }
}


export async function getDonationHistory() {
  const supabase = await createClient()
  const { user } = await getUser()

  if (!user) {
    return { donations: [] }
  }

  const { data, error } = await supabase
    .from('donations')
    .select(`
      *,
      ngos (
        id,
        name,
        logo_url
      ),
      campaigns (
        id,
        title
      )
    `)
    .eq('donor_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return { donations: [] }
  }

  return { donations: data }
}

export async function verifyEmail(token) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.verifyOtp({
    token_hash: token,
    type: 'email',
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}