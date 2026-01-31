"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// app/actions/admin.actions.js - ADD THIS TEST FUNCTION
export async function testDirectUpdate(ngoId) {
  const supabase = await createClient();

  console.log('=== DIRECT UPDATE TEST ===');
  console.log('NGO ID:', ngoId);

  // Try the simplest possible update
  const { data, error, status, statusText } = await supabase
    .from("ngos")
    .update({ is_verified: true })
    .eq("id", ngoId);

  console.log('Status:', status);
  console.log('Status Text:', statusText);
  console.log('Data:', data);
  console.log('Error:', error);
  console.log('Full error object:', JSON.stringify(error, null, 2));

  return { data, error, status };
}
/**
 * Verify NGO - Admin only
 */
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

  console.log(ngoId)
  // Verify the NGO
  const { data, error } = await supabase
    .from("ngos")
    .update({is_verified: true})
    .eq("id", ngoId)
    .select()
    .single()

  if (error) {
    console.log(error.message);
    return { error: "Failed to verify NGO" };
  }

  revalidatePath("/users/admin/dashboard");
  revalidatePath("/ngos");
  return { success: true, message: "NGO verified successfully!" };
}

// /**
//  * Reject NGO - Admin only
//  */
// export async function rejectNGO(ngoId, reason) {
//   const supabase = await createClient()

//   // Check if user is admin
//   const { data: { user } } = await supabase.auth.getUser()

//   if (!user) {
//     return { error: 'You must be logged in' }
//   }

//   const { data: userData } = await supabase
//     .from('users')
//     .select('role')
//     .eq('id', user.id)
//     .maybeSingle()

//   if (userData?.role !== 'admin') {
//     return { error: 'Unauthorized. Admin access required.' }
//   }

//   // Option 1: Delete the NGO
//   // const { error } = await supabase
//   //   .from('ngos')
//   //   .delete()
//   //   .eq('id', ngoId)

//   // Option 2: Mark as rejected (better for keeping records)
//   const { error } = await supabase
//     .from('ngos')
//     .update({
//       is_verified: false,
//       verification_status: 'rejected',
//       // You can add a rejection_reason field to store why
//     })
//     .eq('id', ngoId)

//   if (error) {
//     return { error: 'Failed to reject NGO' }
//   }

//   revalidatePath('/users/admin/dashboard')
//   return { success: true, message: 'NGO rejected' }
// }

/**
 * Verify Campaign - Admin only
 */
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

  // // Get campaign to check
  // const { data: campaign } = await supabase
  //   .from('campaigns')
  //   .select("*")
  //   .eq('id', campaignId)
  //   .maybeSingle()

  // if (!campaign) {
  //   return { error: 'Campaign not found' }
  // }

  // Verify the campaign
  const { error } = await supabase
    .from("campaigns")
    .update({
      is_verified: true,
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

/**
 * Reject Campaign - Admin only
 */
export async function closeCampaign(campaignId) {
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

  // Mark as rejected
  const { error } = await supabase
    .from("campaigns")
    .update({
      status: "closed",
    })
    .eq("id", campaignId);

  if (error) {
    return { error: "Failed to reject campaign" };
  }

  revalidatePath("/users/admin/dashboard");
  return { success: true, message: "Campaign rejected" };
}

/**
 * Get all pending NGOs (Admin only)
 */
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
    .eq("is_verified", false)
    .order("created_at", { ascending: false });

  if (error) {
    console.log("Error", error.message);
    return { ngos: [] };
  }

  return { data: data || [] };
}

/**
 * Get all pending campaigns (Admin only)
 */
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
        is_verified
      ),
      users (
        name,
        email
      )
    `,
    )
    .eq("is_verified", false)
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

  const { data, error } = await supabase.from("donations").select("*");

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: data };
}
