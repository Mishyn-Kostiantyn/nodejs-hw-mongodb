import { Router } from "express";
import { getContactByIdController, getContactsController, createContactController, deleteContactController, patchContactController, validateBody } from "../controllers/contacts.js";
import { createContactSchema } from "../validation/createContactSchema.js";
import { updateContactSchema } from "../validation/updateContactSchema.js";

const router = Router();
export const ctrlWrapper = (controller) => {
  return async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};
router.get('/contacts',ctrlWrapper(getContactsController)) ;
router.get('/contacts/:id', ctrlWrapper(getContactByIdController));
router.post('/contacts', validateBody(createContactSchema), ctrlWrapper(createContactController));
router.patch('/contacts/:id',validateBody(updateContactSchema), ctrlWrapper(patchContactController));
router.delete('/contacts/:id', ctrlWrapper(deleteContactController));
export default router;