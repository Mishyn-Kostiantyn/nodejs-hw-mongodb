import { Router } from "express";
import { getContactByIdController, getContactsController, createContactController, deleteContactController, patchContactController, validateBody, isValidId } from "../controllers/contacts.js";
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
router.get('/',ctrlWrapper(getContactsController)) ;
router.get('/:id',isValidId ,ctrlWrapper(getContactByIdController));
router.post('/', validateBody(createContactSchema), ctrlWrapper(createContactController));
router.patch('/:id',isValidId,validateBody(updateContactSchema), ctrlWrapper(patchContactController));
router.delete('/:id',isValidId, ctrlWrapper(deleteContactController));
export default router;