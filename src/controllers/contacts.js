import { getContactById, getContacts, createContact, deleteContact, updateContact } from "../services/contacts.js";
import createHttpError from "http-errors";

export const getContactsController = async (req, res) => {
    try {
            const contacts = await getContacts();
            res.status(200).json({  status: 200, data: contacts, message: "Successfully found contacts!" });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching contacts', error: error.message });
        }
};
export const getContactByIdController = async (req, res, next) => {
try {
            
            const contact = await getContactById(req.params.id);
           
            if (!contact) {
                next(createHttpError(404, 'Contact not found'));
    return;
            }
            res.status(200).json({ status: 200, data: contact, message:`Successfully found contact with id ${req.params.id}` });
          
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

        const contact = await createContact(req.body);

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
    const contactId= req.params.id;
    
  const contact = await deleteContact(contactId);

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(204).send();
};
export const patchContactController =async (req, res, next) => {
  const contactId = req.params.id;
  const result = await updateContact(contactId, req.body);

  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: result.contact,
  });
};

