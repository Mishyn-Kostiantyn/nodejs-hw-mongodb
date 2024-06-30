import { getContactById, getContacts, createContact, deleteContact, updateContact } from "../services/contacts.js";
import createHttpError from "http-errors";
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";
import { parseFilterParams } from "../utils/parseFilterParams.js";
import { isValidObjectId } from "mongoose";
import { saveFileToUploadDir } from "../utils/saveFileToUploadDir.js";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";
import { env } from "../utils/env.js";


export const getContactsController = async (req, res) => {
    try {
        const { page = 1, perPage = 5 } = parsePaginationParams(req.query);
        const { sortBy, sortOrder } = parseSortParams(req.query);
   
        const filter = parseFilterParams(req.query);
       
        const contacts = await getContacts({ page, perPage, sortBy, sortOrder, filter, userId: req.user._id});
            res.status(200).json({  status: 200, data: contacts, message: "Successfully found contacts!" });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching contacts', error: error.message });
        }
};
export const getContactByIdController = async (req, res, next) => {
  try {
    const user = req.user;
    const contactId = req.params.id;
    const userId = user._id.toString(); 



    const contact = await getContactById(contactId, userId);
    
    if (!contact) {
   
      next(createHttpError(403, 'Contact with this Id does not belong to yours contacts!'));
      return;
    }

    res.status(200).json({ status: 200, data: contact, message: `Successfully found contact with id ${contactId}` });
  } catch (error) {
    
    res.status(500).json({ message: 'Error fetching contact', error: error.message });
  }
};
export const createContactController = async (req, res) => {
    try {
       
        if (!req.body.name || !req.body.phoneNumber || !req.body.contactType) {
            return res.status(400).json({
                status: 400,
                message: 'Bad Request: name, phoneNumber, and contactType are required',
            });
        }

        const contact = await createContact(req.body,req.file, req.user._id);

        res.status(201).json({
            status: 201,
            message: 'Successfully created a contact!',
            data: contact,
        });
    } catch (error) {
        
        res.status(500).json({
            status: 500,
            message: 'Something went wrong',
            data: error.message,
        });
    }
    
};
export const deleteContactController = async (req, res, next) => {
    try {
        const contactId = req.params.id;
        const userId = req.user._id.toString();
        const contact = await deleteContact(contactId, userId);

        if (!contact) {
            next(createHttpError(403, 'Contact with this Id does not belong to yours contacts!'));
            return;
        }

        res.status(204).send();
    } catch (error) {
        
        res.status(500).json({
            status: 500,
            message: 'Something went wrong',
            data: error.message,
        });
    }
};
export const patchContactController = async (req, res, next) => {
  const contactId = req.params.id;
  const userId = req.user._id.toString();
  const photo = req.file;

  let photoUrl;

  try {
    if (photo) {
      if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
    }
    const payload = { ...req.body, ...(photoUrl && { photo: photoUrl }) };
    const result = await updateContact(contactId, userId, payload);

    if (!result) {
      return next(createHttpError(403, 'Contact with this Id does not belong to your contacts!'));
    }

    res.json({
      status: 200,
      message: `Successfully patched a contact!`,
      data: result.contact,
    });
  } catch (error) {
    console.error('Error in patchContactController:', error);
    next(error);
  }
};

export const validateBody = (schema) => async (req, res, next) => { 
    try {await schema.validateAsync(req.body, { abortEarly: false });
        next();

    }
    catch (error) { next(createHttpError(400, { message: 'Bad Request', error: error.details.map(e => e.message) } ));}
};
export const isValidId = (req, res, next) => {
   
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    next(createHttpError(404, "Invalid contact id"));
  }

  next();
};