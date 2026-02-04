"use server"

import DonatePage from "@/components/DonateClient";

export default async function Page({ searchParams }) {
  const params = await searchParams; 
  console.log("Searchparams : ",params)
  return <DonatePage searchParams={params} />;
}
