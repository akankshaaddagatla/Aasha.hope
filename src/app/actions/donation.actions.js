"use server";
import { createClient } from "@/lib/supabase/server";

//  Get successful donations by user
export async function getSuccessfulDonations() {
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
    .eq("donor_id", user.id)
    .eq("payment_status", "successful")
    .order("donated_at", { ascending: false });

  if (error) {
    return { success : false, data : [] };
  }

  return { success : true, data: data };
}

// Get total donated amount by user
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
    .eq("donor_id", user.id)
    .eq("payment_status", "successful");

  if (error || !data) {
    return { total: 0 };
  }

  const total = data.reduce(
    (sum, donation) => sum + Number(donation.amount),
    0
  );

  return { success: true, data : total };
}
