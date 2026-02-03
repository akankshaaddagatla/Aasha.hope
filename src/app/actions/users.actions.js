"use server";

import { createClient } from "@/lib/supabase/server";

export async function getAllUsers() {
  const supabase = await createClient();

  const { data, error } = await supabase.from("users").select("*");

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: data };
}

export async function getUserById(userId) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.log("Error", error.message);
    return { success: false, error: error.message };
  }

  return { success: true, data: data };
}

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Error getting user:", error.message);
    return { success: false, error: error };
  }
  return { success: true, data: user };
}

export async function getAdminProfile() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("role", "admin")
    .maybeSingle();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: data };
}

export async function getCurrentUserProfile() {
  const supabase = await createClient();

  const { data: user, error: userError } = await getUser();
  if (userError) {
    return { success: false, error: userError };
  }

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if(error){
    return {success: false, error: error}
  }

  return {success: true, data: data}
}

export async function updateUserProfile(userId, formData) {
  const supabase = await createClient();

  // Get current role (IMPORTANT — never trust frontend)
  const { data: existingUser, error: fetchError } = await supabase
    .from("users")
    .select("role")
    .eq("id", userId)
    .single();

  if (fetchError) throw new Error(fetchError.message);

  const newRole = formData.get("role");

  // Role Protection
  if(newRole){
  if (existingUser.role === "ngo" && newRole !== "ngo") {
    throw new Error("NGOs cannot change their role.");
  }
}

  const updateData = {
    name: formData.get("name")?.trim() || undefined,
    email: formData.get("email")?.trim() || undefined,
  };

  // Only allow donor -> ngo
  if (existingUser.role === "donor" && newRole === "ngo") {
    updateData.role = "ngo";
  }

  // remove undefined
  const cleanedData = Object.fromEntries(
    Object.entries(updateData).filter(([_, v]) => v !== undefined)
  );

  const { error } = await supabase
    .from("users")
    .update(cleanedData)
    .eq("id", userId);

  if (error) throw new Error(error.message);

  return { success: true };
}
