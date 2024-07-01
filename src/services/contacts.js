import { Contacts } from "../db/models/contact.js";
import mongoose from 'mongoose';
import { calculatePaginationData } from "../utils/calculatePaginationData.js";
import { SORT_ORDER } from "../constants/index.js";
import { saveFileToUploadDir } from "../utils/saveFileToUploadDir.js";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";
import { env } from "../utils/env.js";
export const getContacts = async ({ page = 1, perPage = 5, sortBy='name',sortOrder=SORT_ORDER.ASC,filter={}, userId  }) => {

  

  const contactsQuery = Contacts.find();
 
  console.log('filter_services:',filter);
  if (filter.contactType) { contactsQuery.where('contactType').equals(filter.contactType); };
  if (filter.isFavourite !== undefined) { contactsQuery.where('isFavourite', filter.isFavourite); };
  contactsQuery.where('userId').equals(userId);
  const contactsCount = await Contacts.find().merge(contactsQuery).countDocuments();
  const paginationData = calculatePaginationData(contactsCount, page, perPage);
  const numberOfPages=paginationData.totalPages;
  const skip = (page <= numberOfPages) ? (page - 1) * perPage : 0;
  const limit = perPage;
  const contacts = await contactsQuery.skip(skip).limit(limit).sort({ [sortBy]: sortOrder }).exec();
  // const [contactsCount, contacts] = await Promise.all([Contacts.find().merge(contactsQuery).countDocuments(),
  // contactsQuery.skip(skip).limit(limit).sort({ [sortBy]: sortOrder }).exec()]);
  
  return {
    data: contacts,
    ...paginationData,
  };
};
export    const getContactById = async (id, userId) => {

 if (!mongoose.Types.ObjectId.isValid(id)) {
    
    return null;
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
   
    return null;
  }

  

  const contact = await Contacts.findOne({ _id: id, userId: userId });
 

  return contact;
};
export const createContact = async (data, photoFile, userId) => {
  
  
  let photoUrl;
  try {
    if (photoFile) { if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photoFile);
    } else {
      photoUrl = await saveFileToUploadDir(photoFile);
    } };
        const contact = await Contacts.create({...data,  userId: userId, photo: photoUrl });
        return contact;
    } catch (error) {
        console.error('Error in createContact:', error);
        throw new Error(`Contact creation failed: ${error.message}`);
    }
};
export const deleteContact = async (contactId, userId) => {
  const contact = await Contacts.findOneAndDelete({
    _id: contactId, userId: userId,
  });

  return contact;
};
export const updateContact = async (contactId,userId, payload, options = {}) => {
  const rawResult = await Contacts.findOneAndUpdate(
    { _id: contactId, userId: userId },
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