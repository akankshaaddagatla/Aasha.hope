"use server"
import { createClient } from "@/lib/supabase/server"


export async function getAllNgos(){
    try{
        const supabase = await createClient();

        const {data : ngos, error} = await supabase.from("ngos").select("*");
        if(error){
            console.error("Error while getting ngos :", error.message);
            return{success : false, error}
        }

        return {success : true, data : ngos}
    }catch(err){
        console.error("Some Error while getting ngos :", err.message);
        return{success : false, err}
    }
}

export async function getNgoById(id){
    try{
        const supabase = await createClient();

        const {data : ngo, error} = await supabase.from("ngos").select("*").eq("id", id).single();
        if(error){
            console.error("Error while getting ngo :", error.message);
            return{success : false, error}
        }

        return {success : true, data : ngo}
    }catch(err){
        console.error("Some Error while getting ngo :", err.message);
        return{success : false, err}
    }
}