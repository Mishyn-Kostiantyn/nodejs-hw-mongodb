import Joi from 'joi';

export const updateContactSchema = Joi.object({
    name: Joi.string().min(3).max(35),
    email: Joi.string().email(),
    phoneNumber: Joi.string().min(3).max(35),
    isFavourite: Joi.boolean(), 
    contactType: Joi.string().valid('work', 'home', 'personal'),
});