"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getVerifiedCampaigns() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("campaigns")
    .select(
      `
      *,
      ngos (
        id,
        name,
        cover_image_url
      )
    `,
    )
    .eq("is_verified", true)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) {
    return { success : false, error : error};
  }

  return {success : true, data: data || [] };
}

/**
 * Get single campaign by ID
 */
export async function getCampaignById(id) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return { sucess: false, error: "Campaign not found" };
  }

  return { success: true, data: data };
}

/**
 * Get campaigns by NGO
 */
export async function getCampaignsByNGO(ngoId) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .eq("ngo_id", ngoId)
    .eq("is_verified", true)
    .order("created_at", { ascending: false });

  if (error) {
    return { success : false , data: [] };
  }

  return {success : true, data: data || [] };
}



/**
 * Create new campaign
 */
export async function createCampaign(formData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {success : false, error: "You must be logged in" };
  }

  if (!formData.title || !formData.description || !formData.amountRaising) {
    return { success : false,error: "Missing required fields" };
  }

  const { data, error } = await supabase
    .from("campaigns")
    .insert({
      created_by: user.id,
      ngo_id: formData.ngoId,
      title: formData.title,
      description: formData.description,
      cause_statement: formData.causeStatement,
      cover_image_url: formData.coverImageUrl,
      campaign_story: formData.campaignStory,
      amount_raising: formData.amountRaising,
    })
    .select()
    .single();

    console.log(data)
    console.log(error)
  if (error) {
    return { success : false, error: "Failed to create campaign" };
  }

  revalidatePath("/campaigns");
  return { success: true, data: data };
}

/**
 * Update campaign
 */
export async function updateCampaign(campaignId, formData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success : false, error: "You must be logged in" };
  }

  // Verify ownership
  const { data: campaign } = await supabase
    .from("campaigns")
    .select("created_by")
    .eq("id", campaignId)
    .single();

  if (!campaign || campaign.created_by !== user.id) {
    return { success : false, error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("campaigns")
    .update(formData)
    .eq("id", campaignId);

  if (error) {
    return { success : false, error: "Failed to update campaign" };
  }

  revalidatePath(`/campaigns/${campaignId}`);
  return { success: true };
}
