"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  updateUserProfile,
  getCurrentUserProfile,
} from "@/app/actions/users.actions";

export default function EditProfile() {
  const router = useRouter()
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function init() {
      const { data, error } = await getCurrentUserProfile();
      if (error) {
        console.error("Error getting user", error.message);
      }

      setUser(data);
    }

    init();
  }, []);

  async function handleUpdate(formData) {
    const { success, error } = await updateUserProfile(user.id, formData);

    if (success) {
        user.role == 'donor' ? router.push("/users/donor/dashboard") : router.push("/users/ngo")
    }

    console.error("Error updating profile", error.message);
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 m-10 rounded-2xl shadow-xl">
      <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>

      <form action={handleUpdate} className="space-y-5">
        <Input label="Full Name" name="name" defaultValue={user?.name} />

        <Input label="Email" name="email" defaultValue={user?.email} />

        {/* Role */}
        {user?.role === "donor" && (
          <div>
            <label className="font-medium block mb-1">Role</label>

            <select
              name="role"
              defaultValue={user.role}
              className="w-full border rounded-lg p-3"
            >
              <option value="donor">Donor</option>
              <option value="ngo">NGO</option>
            </select>
          </div>
        )}

        <button className="w-full bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg font-semibold transition">
          Update Profile
        </button>
      </form>
    </div>
  );
}

/* reusable */
function Input({ label, ...props }) {
  return (
    <div>
      <label className="font-medium block mb-1">{label}</label>
      <input {...props} className="w-full border rounded-lg p-3" />
    </div>
  );
}
