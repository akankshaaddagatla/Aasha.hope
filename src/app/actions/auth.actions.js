"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function signUp(formData) {
  const supabase = await createClient();

  const { email, password, name, role } = formData;

  // Validate inputs
  if (!email || !password || !name) {
    return { error: "All fields are required" };
  }

  // Sign up supabase auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name,
        role: role,
      },
    },
  });

  if (authError) {
    return { error: authError.message };
  }

  // Create user profile in users table
  if (authData.user) {
    const { error: profileError } = await supabase.from("users").insert({
      id: authData.user.id,
      email: email,
      name: name,
      role: role,
    });

    if (profileError) {
      return { error: "Failed to create user profile" };
    }
  }

  return {
    success: true,
    message: "Please check your email to verify your account",
  };
}

export async function signIn(formData) {
  const supabase = await createClient();

  const { email, password } = formData;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signOut() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/');
}

export async function getUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { user: null };
  }

  // Get user profile data
  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError) {
    return { user: null };
  }

  return {
    data: profile
  };
}

// export async function updateProfile(updates) {
//   const supabase = await createClient();

//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (!user) {
//     return { error: "Not authenticated" };
//   }

//   const { error } = await supabase
//     .from("users")
//     .update(updates)
//     .eq("id", user.id);

//   if (error) {
//     return { error: error.message };
//   }

//   revalidatePath("/profile");
//   return { success: true };
// }

export async function checkRole(requiredRole) {
  const { user } = await getUser();

  if (!user?.profile?.role) {
    return false;
  }

  return user.profile.role === requiredRole;
}
