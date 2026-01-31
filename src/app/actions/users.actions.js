"use server"

import { createClient } from "@/lib/supabase/server";

export async function getAllUsers() {
    const supabase = await createClient();

    const {data, error} = await supabase.from('users').select("*");

    if(error){    
       return {success: false, error: error.message}
    }

    return {success: true, data : data}
}

export async function getUserById(userId){
    const supabase = await createClient();

    const {data, error} = await supabase.from('users').select("*").eq("id", userId).maybeSingle();

    if(error){  
       console.log("Error", error.message);  
       return {success: false, error: error.message}
    }

    return {success: true, data : data}
}

export async function getUser(){
    const supabase = await createClient();
    const { data:{user} , error } = await supabase.auth.getUser()
    
    if(error){
        console.error("Error getting user:", error.message);
        return {success : false, error : error}
    }
    return{success : true, data : user}
}