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
export const createContact= async (data) => {
    try {
        const contact = await Contacts.create(data);
        return contact;
    } catch (error) {
        console.error('Error in createContact:', error);
        throw new Error(`Contact creation failed: ${error.message}`);
    }
};
export const deleteContact = async (contactId) => {
  const contact = await Contacts.findOneAndDelete({
    _id: contactId,
  });

  return contact;
};
export const updateContact = async (contactId, payload, options = {}) => {
  const rawResult = await Contacts.findOneAndUpdate(
    { _id: contactId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};