import { Contacts } from "../db/models/contact.js";
import mongoose from 'mongoose';
import { calculatePaginationData } from "../utils/calculatePaginationData.js";
import { SORT_ORDER } from "../constants/index.js";
export const getContacts = async ({ page = 1, perPage = 5, sortBy='name',sortOrder=SORT_ORDER.ASC,filter={}  }) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;
  

  const contactsQuery = Contacts.find();
  // console.log(filter);
  if (filter.contactType) { contactsQuery.where('contactType').equals(filter.contactType); };
  if (filter.isFavourite !== undefined) { contactsQuery.where('isFavourite',filter.isFavourite); };
  const [contactsCount, contacts] = await Promise.all([Contacts.find().merge(contactsQuery).countDocuments(), contactsQuery.skip(skip).limit(limit).sort({[sortBy]:sortOrder}).exec()]);
  const paginationData=calculatePaginationData(contactsCount,page,perPage);
  return {
    data: contacts,
    ...paginationData,
  };
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