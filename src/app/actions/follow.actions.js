"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function followNGO(ngoId) {
  const supabase = await createClient();
  console.log("FOLLOW NGO CALLED:", ngoId);

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "You must be logged in to follow NGOs" };
  }

  // Check if NGO exists and is verified
  const { data: ngo, error: ngoError } = await supabase
    .from("ngos")
    .select("id, is_verified, followers_count")
    .eq("id", ngoId)
    .maybeSingle();

  if (ngoError || !ngo) {
    return { error: "NGO not found" };
  }

  if (!ngo.is_verified) {
    return { error: "This NGO is not verified yet" };
  }

  // Check if already following
  const { data: existingFollow } = await supabase
    .from("follows")
    .select("id")
    .eq("ngo_id", ngoId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingFollow) {
    return { error: "You are already following this NGO" };
  }

  // Create follow relationship
  const { data: followData, error: followError } = await supabase.from("follows").insert({
    ngo_id: ngoId,
    user_id: user.id,
  }).select()

  console.log("FOLLOW INSERT:", followData);

  if (followError) {
    return { error: "Failed to follow NGO" };
  }

  // Update follower count
  const { error: updateError } = await supabase
    .from("ngos")
    .update({ followers_count: (ngo.followers_count || 0) + 1 })
    .eq("id", ngoId);

  if (updateError) {
    console.error("Failed to update follower count:", updateError);
  }

  revalidatePath(`/ngos/${ngoId}`);
  revalidatePath("/dashboard");

  return { success: true, message: "Successfully followed NGO!" };
}

export async function unfollowNGO(ngoId) {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "You must be logged in" };
  }

  // Get current follower count
  const { data: ngo } = await supabase
    .from("ngos")
    .select("followers_count")
    .eq("id", ngoId)
    .single();

  const { data: follow } = await supabase
    .from("follows")
    .select("id")
    .eq("ngo_id", ngoId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!follow) {
    return { error: "You are not following this NGO" };
  }

  // Delete follow relationship
  const { error: unfollowError } = await supabase
    .from("follows")
    .delete()
    .eq("ngo_id", ngoId)
    .eq("user_id", user.id);

  if (unfollowError) {
    return { error: "Failed to unfollow NGO" };
  }

  // Update follower count
  if (ngo) {
    const { error: updateError } = await supabase
      .from("ngos")
      .update({
        followers_count: Math.max((ngo.followers_count || 0) - 1, 0),
      })
      .eq("id", ngoId);

    if (updateError) {
      console.error("Failed to update follower count:", updateError);
    }
  }

  revalidatePath(`/ngos/${ngoId}`);
  revalidatePath("/dashboard");

  return { success: true, message: "Unfollowed NGO" };
}

export async function checkIfFollowing(ngoId) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: false };
  }

  const { data, error } = await supabase
    .from("follows")
    .select("id")
    .eq("ngo_id", ngoId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    return { data: false };
  }

  return { data: !!data };
}

// ngos followed by a user
export async function getFollowedNGOs() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: [] };
  }

  const { data, error } = await supabase
    .from("follows")
    .select(
      `
      followed_at,
      ngos (
        id,
        name,
        description,
        followers_count,
        amount_raised
      )
    `,
    )
    .eq("user_id", user.id)
    .order("followed_at", { ascending: false });

  if (error) {
    // console.error("Error fetching followed NGOs:", error);
    return { data: [] };
  }

  return { data: data.map((item) => item.ngos) };
}

//  Get follower count for an NGO
export async function getFollowerCount(ngoId) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("ngos")
    .select("followers_count")
    .eq("id", ngoId)
    .single();

  if (error) {
    return { data: 0 };
  }

  return { data: data.followers_count || 0 };
}

//  Get followers for an NGO

export async function getNGOFollowers(ngoId) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: [], error: "Not authenticated" };
  }

  // Verify user is the NGO admin
  const { data: ngo } = await supabase
    .from("ngos")
    .select("owner_id")
    .eq("id", ngoId)
    .maybeSingle();

  if (!ngo || ngo.owner_id !== user.id) {
    return { data: [], error: "Unauthorized" };
  }

  // Get followers
  const { data, error } = await supabase
    .from("follows")
    .select(
      `
      followed_at,
      users (
        id,
        name,
        email,
      )
    `,
    )
    .eq("ngo_id", ngoId)
    .order("followed_at", { ascending: false });

  if (error) {
    // console.error("Error fetching followers:", error);
    return { data: [] };
  }

  return {
    data: data.map((item) => ({
      ...item.users,
      followed_at: item.followed_at,
    })),
  };
}
