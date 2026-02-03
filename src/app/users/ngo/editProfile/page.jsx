"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getMyNGO, updateNgo } from "@/app/actions/ngo.actions";
import Link from "next/link";

export default function EditNgoPage() {
    const router = useRouter()
   const [ngo, setNgo] = useState(null);
  
   useEffect(()=>{
    async function init(){
        const { data, error } = await getMyNGO()
        if(error){
            console.error("Error getting ngo",error.message)
        }

        setNgo(data);
    }

    init()
   },[])

   async function handleUpdate(formData) {
    const {success, error} = await updateNgo(ngo.id, formData);
    if(success){
        router.push('/users/ngo')
    }

    console.error("Error updating ngo", error.message);
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 my-10 rounded-2xl shadow-xl">
      <Link href="/users/ngo" className="text-purple-500 hover:text-purple-800">Back to Profile</Link>
      <h1 className="text-3xl font-bold mb-6">
        Edit NGO
      </h1>

      <form action={handleUpdate} className="space-y-6">

        {/* NGO Name */}
        <Input label="NGO Name" name="name" defaultValue={ngo?.name} />

        {/* Description */}
        <TextArea
          label="Description"
          name="description"
          defaultValue={ngo?.description}
        />

        {/* Cause */}
        <Input
          label="Cause Statement"
          name="cause_statement"
          defaultValue={ngo?.cause_statement}
        />

        {/* Logo */}
        <Input
          label="Logo URL"
          name="logo_url"
          defaultValue={ngo?.logo_url}
        />

        {/* Cover */}
        <Input
          label="Cover Image URL"
          name="cover_image_url"
          defaultValue={ngo?.cover_image_url}
        />

        {/* Goal */}
        <Input
          label="Fundraising Goal (₹)"
          name="amount_raising"
          type="number"
          defaultValue={ngo?.amount_raising}
        />

        <button className="w-full bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg font-semibold transition"
                type="submit">
          Update NGO
        </button>
      </form>
    </div>
  );
}

/* Small reusable inputs */

function Input({ label, ...props }) {
  return (
    <div>
      <label className="font-medium block mb-1">
        {label}
      </label>
      <input
        {...props}
        className="w-full border rounded-lg p-3"
      />
    </div>
  );
}

function TextArea({ label, ...props }) {
  return (
    <div>
      <label className="font-medium block mb-1">
        {label}
      </label>
      <textarea
        {...props}
        rows={4}
        className="w-full border rounded-lg p-3"
      />
    </div>
  );
}
