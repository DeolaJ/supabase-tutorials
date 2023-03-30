import { useMutation } from "@tanstack/react-query";

import supabase from "../lib/supabase";

const updateContacts = async (contact) => {
    const { data, error } = await supabase.from("contacts").insert(contact);
    if (error) {
        throw error;
    }
    return data;
};

export default function useUpdateContacts() {
    return useMutation((contact) => updateContacts(contact));
}
