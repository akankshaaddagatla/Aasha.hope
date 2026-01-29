"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Donate to Campaign
 */
export async function donateToCampaign(formData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to donate" };
  }

  const amount = Number(formData.amount);
  if (!amount || amount <= 0) {
    return { error: "Invalid donation amount" };
  }

  // Get campaign details
  const { data: campaign, error: campaignError } = await supabase
    .from("campaigns")
    .select(
      "id, is_verified, status, amount_raising, amount_raised, total_donations"
    )
    .eq("id", formData.campaignId)
    .single();

  if (campaignError || !campaign) {
    return { error: "Campaign not found" };
  }

  if (!campaign.is_verified) {
    return { error: "This campaign is not verified yet" };
  }

  if (campaign.status !== "active") {
    return { error: "This campaign is no longer active" };
  }

  if (campaign.amount_raised >= campaign.amount_raising) {
    return { error: "This campaign has already reached its goal" };
  }

  // Prevent overshoot
  const newAmountRaised = Math.min(
    campaign.amount_raised + amount,
    campaign.amount_raising
  );

  const goalReached = newAmountRaised >= campaign.amount_raising;

  // Insert donation
  const { data: donation, error } = await supabase
    .from("donations")
    .insert({
      donor_id: user.id,
      donated_by: formData.donatedBy || "Anonymous",
      amount,
      type: "one-time",
      campaign_id: formData.campaignId,
      ngo_id: null,
    })
    .select()
    .single();

  if (error) {
    return { error: "Failed to process donation" };
  }

  // Update campaign
  const updateData = {
    amount_raised: newAmountRaised,
    total_donations: (campaign.total_donations || 0) + 1,
  };

  if (goalReached) {
    updateData.status = "closed";
  }

  const { error: updateError } = await supabase
    .from("campaigns")
    .update(updateData)
    .eq("id", formData.campaignId);

  if (updateError) {
    console.error("Failed to update campaign:", updateError.message);
  }

  revalidatePath("/dashboard");
  revalidatePath(`/campaigns/${formData.campaignId}`);

  return {
    success: true,
    donation,
    goalReached,
    message: goalReached
      ? "Thank you! This campaign has now reached its goal! 🎉"
      : "Thank you for your donation!",
  };
}

/**
 * Donate to NGO directly
 */
export async function donateToNGO(formData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to donate" };
  }

  const amount = Number(formData.amount);
  if (!amount || amount <= 0) {
    return { error: "Invalid donation amount" };
  }

  const { data: ngo } = await supabase
    .from("ngos")
    .select("id, is_verified")
    .eq("id", formData.ngoId)
    .single();

  if (!ngo) {
    return { error: "NGO not found" };
  }

  if (!ngo.is_verified) {
    return { error: "This NGO is not verified yet" };
  }

  const { data, error } = await supabase
    .from("donations")
    .insert({
      donor_id: user.id,
      donated_by: formData.donatedBy || "Anonymous",
      amount,
      type: "one-time",
      ngo_id: formData.ngoId,
      campaign_id: null,
    })
    .select()
    .single();

  if (error) {
    return { error: "Failed to process donation" };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/ngos/${formData.ngoId}`);

  return { success: true, data: data };
}

/**
 * Create monthly donation (NOTE: not recurring yet)
 */
export async function createMonthlyDonation(formData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to donate" };
  }

  const amount = Number(formData.amount);
  if (!amount || amount <= 0) {
    return { error: "Invalid donation amount" };
  }

  const { data, error } = await supabase
    .from("donations")
    .insert({
      donor_id: user.id,
      donated_by: formData.donatedBy || "Anonymous",
      amount,
      type: "monthly",
      ngo_id: formData.ngoId || null,
      campaign_id: formData.campaignId || null,
    })
    .select()
    .single();

  if (error) {
    return { error: "Failed to process donation" };
  }

  revalidatePath("/dashboard");
  return { success: true, data: data };
}

/**
 * Get user's donation history
 */
export async function getDonationHistory() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {success : false, error:"You must be logged in" };
  }

  const { data, error } = await supabase
    .from("donations")
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
    .eq("donor_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return { success : false, data : [] };
  }

  return { success : true, data: data || []};
}

/**
 * Get total donated by user
 */
export async function getTotalDonated() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { total: 0 };
  }

  const { data, error } = await supabase
    .from("donations")
    .select("amount")
    .eq("donor_id", user.id);

  if (error || !data) {
    return { total: 0 };
  }

  const total = data.reduce(
    (sum, donation) => sum + Number(donation.amount),
    0
  );

  return { success: true, data : total };
}
