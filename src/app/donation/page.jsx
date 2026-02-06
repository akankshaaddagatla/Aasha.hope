"use server"

import DonatePage from "@/components/DonateClient";

export default async function Page({ searchParams }) {
  const params = await searchParams; 
  
  return <DonatePage searchParams={params} />;
}
