import Joi from 'joi';

export const createContactSchema = Joi.object({
    name: Joi.string().required().min(3).max(20),
    email: Joi.string().email().min(3).max(20),
    phoneNumber: Joi.string().required().min(3).max(20),
    isFavourite: Joi.boolean(), 
    contactType: Joi.string().valid('work', 'home', 'personal').required(),
});
/*name: { type: String, required: true },
    email: {
        type: String,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        required: false
    },
    
    phoneNumber: { type: String, required: true },
    
    isFavourite: { type: Boolean, default: false },
    contactType: { type: String, required: true, enum: ['work', 'home', 'personal'], default: 'personal' },
},{timestamps: true, versionKey: false}*/