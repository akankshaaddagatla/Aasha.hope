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

    const {data, error} = await supabase.from('users').select("*").eq("id", userId).single();
    if(error){    
       return {success: false, error: error.message}
    }

    return {success: true, data : data}
}

export async function getUser(){
    const { data, error } = await supabase.auth.getUser()
    if(error){
        return {success : false, error : error}
    }
    return{success : true, data : data}
}