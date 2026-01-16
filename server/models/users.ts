'use strict';
import { Schema, model, Document,  type InferSchemaType } from 'mongoose';


const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  }
}, {
  timestamps: true,
});


export type UserType = InferSchemaType<typeof userSchema>;


export interface IUser extends UserType, Document {}

const User = model<IUser>('User', userSchema);

export default User;