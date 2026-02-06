"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Verify NGO - Admin only
export async function verifyNGO(ngoId) {
  const supabase = await createClient();

  // Check if user is admin
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in" };
  }

  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (userData?.role !== "admin") {
    return { error: "Unauthorized. Admin access required." };
  }

  console.log(ngoId);
  // Verify the NGO
  const { data, error } = await supabase
    .from("ngos")
    .update({ verification_status: "verified" })
    .eq("id", ngoId)
    .select()
    .single();

  if (error) {
    console.log(error.message);
    return { error: "Failed to verify NGO" };
  }

  revalidatePath("/users/admin/dashboard");
  revalidatePath("/ngos");
  return { success: true, message: "NGO verified successfully!" };
}

export async function rejectNgo(ngoId) {
  const supabase = await createClient();

  // Check if user is admin
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in" };
  }

  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (userData?.role !== "admin") {
    return { error: "Unauthorized. Admin access required." };
  }

  const { data, error } = await supabase
    .from("ngos")
    .update({ verification_status: "rejected" })
    .eq("id", ngoId)
    .select()
    .single();

  if (error) {
    console.log(error.message);
    return { error: "Failed to reject NGO" };
  }

  revalidatePath("/users/admin/dashboard");
  return { success: true, message: "Ngo rejected" };
}

// Verify Campaign - Admin only
export async function verifyCampaign(campaignId) {
  const supabase = await createClient();

  // Check if user is admin
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in" };
  }

  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (userData?.role !== "admin") {
    return { error: "Unauthorized. Admin access required." };
  }

  // Verify the campaign
  const { error } = await supabase
    .from("campaigns")
    .update({
      verification_status: "verified",
      status: "active", // Set to active once verified
    })
    .eq("id", campaignId);

  if (error) {
    return { error: "Failed to verify campaign" };
  }

  revalidatePath("/users/admin/dashboard");
  revalidatePath("/campaigns");
  return { success: true, message: "Campaign verified and activated!" };
}

// Reject Campaign - Admin only
export async function rejectCampaign(campaignId) {
  const supabase = await createClient();

  // Check if user is admin
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in" };
  }

  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (userData?.role !== "admin") {
    return { error: "Unauthorized. Admin access required." };
  }

  // Mark as closed
  const { error } = await supabase
    .from("campaigns")
    .update({
      verification_status: "rejected",
      status: "closed",
    })
    .eq("id", campaignId);

  if (error) {
    return { error: "Failed to reject campaign" };
  }

  revalidatePath("/users/admin/dashboard");
  return { success: true, message: "Campaign rejected" };
}

// Get all pending NGOs (Admin only)
export async function getPendingNGOs() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ngos: [], error: "Not authenticated" };
  }

  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (userData?.role !== "admin") {
    return { ngos: [], error: "Unauthorized" };
  }

  const { data, error } = await supabase
    .from("ngos")
    .select(
      `
      *,
      users (
        name,
        email
      )
    `,
    )
    .eq("verification_status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    console.log("Error", error.message);
    return { ngos: [] };
  }

  return { data: data || [] };
}

// Get all pending campaigns (Admin only)
export async function getPendingCampaigns() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { campaigns: [], error: "Not authenticated" };
  }

  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (userData?.role !== "admin") {
    return { campaigns: [], error: "Unauthorized" };
  }

  const { data, error } = await supabase
    .from("campaigns")
    .select(
      `
      *,
      ngos (
        name,
        verification_status
      ),
      users (
        name,
        email
      )
    `,
    )
    .eq("verification_status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    return { campaigns: [] };
  }

  return { data: data || [] };
}

export async function getAllDonations() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { campaigns: [], error: "Not authenticated" };
  }

  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (userData?.role !== "admin") {
    return { campaigns: [], error: "Unauthorized" };
  }

  const { data, error } = await supabase
    .from("donations")
    .select(`*,ngos(id,name),campaigns(id,title), users(name)`)
    .order('donated_at', {ascending : false})

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: data };
}

export async function getAllSuccessfulDonations() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {success : false, error:"You must be logged in" };
  }

  const { data, error } = await supabase
    .from("donations")
    .select(`*,
      ngos(id,name), campaigns(id, title)`)
    .eq("payment_status", "successful")
    .order("donated_at", { ascending: false });

  if (error) {
    return { success : false, data : [] };
  }

  return { success : true, data: data };
}

export async function getAllPosts() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { campaigns: [], error: "Not authenticated" };
  }

  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (userData?.role !== "admin") {
    return { campaigns: [], error: "Unauthorized" };
  }

  const { data, error } = await supabase
    .from("posts")
    .select("*");

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: data };
}