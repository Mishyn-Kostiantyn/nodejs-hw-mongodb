import { Contacts } from "../db/models/contact.js";
import mongoose from 'mongoose';
export const getContacts = async () => {
    const contacts = await Contacts.find();

    return contacts;
};
export    const getContactById = async (id) => {

    if (!mongoose.Types.ObjectId.isValid(id)) {
  return null;
  }
    const contact = await Contacts.findById(id);
    return contact;
};

