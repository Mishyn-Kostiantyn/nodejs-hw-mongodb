import { Router } from "express";
import { getContactByIdController, getContactsController, createContactController, deleteContactController, patchContactController, validateBody, isValidId } from "../controllers/contacts.js";
import { createContactSchema } from "../validation/createContactSchema.js";
import { updateContactSchema } from "../validation/updateContactSchema.js";
import { authenticate } from "../middleware/authenticate.js";
import { upload } from "../middleware/multer.js";

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
router.get('/',authenticate,ctrlWrapper(getContactsController)) ;
router.get('/:id',isValidId ,authenticate,ctrlWrapper(getContactByIdController));
router.post('/', authenticate, upload.single('photo'),validateBody(createContactSchema),ctrlWrapper(createContactController));
router.patch('/:id',isValidId,authenticate, upload.single('photo'),validateBody(updateContactSchema), ctrlWrapper(patchContactController));
router.delete('/:id',isValidId, authenticate, ctrlWrapper(deleteContactController));
export default router;