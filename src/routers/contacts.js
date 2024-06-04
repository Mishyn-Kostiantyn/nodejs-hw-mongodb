import { Router } from "express";
import { getContactByIdController, getContactsController, createContactController, deleteContactController, patchContactController } from "../controllers/contacts.js";

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
router.post('/contacts', ctrlWrapper(createContactController));
router.patch('/contacts/:id', ctrlWrapper(patchContactController));
router.delete('/contacts/:id', ctrlWrapper(deleteContactController));
export default router;