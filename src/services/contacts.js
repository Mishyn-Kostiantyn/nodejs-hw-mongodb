import { Contacts } from "../db/models/contact.js";
export const getContacts = async () => {
    const contacts = await Contacts.find();
    console.log("Contacts fetched from database:", contacts);
    return contacts;
};
export const getContactById = async (id) => { const contact = await Contacts.findById(id); return contact; };
    
console.log('Contacts Model:', Contacts);
