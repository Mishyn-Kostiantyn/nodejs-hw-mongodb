import Joi from 'joi';

export const createContactSchema = Joi.object({
    name: Joi.string().required().min(3).max(35),
    email: Joi.string().email(),
    phoneNumber: Joi.string().required().min(3).max(35),
    isFavourite: Joi.boolean(), 
    contactType: Joi.string().valid('work', 'home', 'personal').required(),
 
    photo: Joi.string(),
});
