"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getVerifiedNgos(){
  const supabase = await createClient();

    const { data: ngos, error } = await supabase
      .from("ngos")
      .select("*")
      .eq("is_verified", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error while getting ngos :", error.message);
      return { success: false, error };
    }

    return { success: true, data: ngos };
}

export async function getNgoById(id) {
  try {
    const supabase = await createClient();

    const { data: ngo, error } = await supabase
      .from("ngos")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
    //   console.error("Error while getting ngo :", error.message);
      return { success: false, error };
    }

    return { success: true, data: ngo };
  } catch (err) {
    console.error("Some Error while getting ngo :", err.message);
    return { success: false, err };
  }
}

export async function createNGO(formData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in" };
  }

  //check role
  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (userData?.role !== "ngo") {
    return { error: "Only NGO admins can create NGOs" };
  }

  const { data, error } = await supabase
    .from("ngos")
    .insert({
      owner_id: user.id,
      name: formData.name,
      description: formData.description,
      cause_statement: formData.causeStatement,
      cover_image_url: formData.coverImageUrl,
      logo_url: formData.logoUrl,
      amount_raising: formData.amountRaising || 0,
    })
    .select()
    .single();

  if (error) {
    return { error: "Failed to create NGO" };
  }

  revalidatePath("/ngos");
  return { success: true, data: data };
}

// Get NGO owned by current user
export async function getMyNGO() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log(user);

  if (!user) {
    return { data: null };
  }

  const { data, error } = await supabase
    .from("ngos")
    .select("*")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (error) {
    console.log("Data",error.message);
    return { data: null };
  }

  return { data: data };
}

// export async function updateNGO(ngoId, formData) {
//   const supabase = await createClient();

//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (!user) {
//     return { error: "You must be logged in" };
//   }

//   // Verify ownership
//   const { data: ngo } = await supabase
//     .from("ngos")
//     .select("owner_id")
//     .eq("id", ngoId)
//     .maybeSingle();

//   if (!ngo || ngo.owner_id !== user.id) {
//     return { error: "Unauthorized" };
//   }

//   const { error } = await supabase
//     .from("ngos")
//     .update(formData)
//     .eq("id", ngoId);

//   if (error) {
//     return { error: "Failed to update NGO" };
//   }

//   revalidatePath(`/ngos/${ngoId}`);
//   return { success: true };
// }