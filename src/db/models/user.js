import { Schema, model } from 'mongoose';
const usersSchema = new Schema(
    {
        name: { type: String, required: true },
         email: {type: String, match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
            required: true, unique: true
        },
         password:{type:String, required:true},
    },
    { timestamps: true, versionKey: false },
);
usersSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    return user;
};
export const UsersCollection = model('users', usersSchema);