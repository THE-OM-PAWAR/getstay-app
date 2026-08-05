import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IGuestUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

const guestUserSchema = new Schema<IGuestUser>(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
    },
  },
  {
    timestamps: true,
  }
);

export const GuestUser =
  (mongoose.models.GuestUser as Model<IGuestUser>) ||
  mongoose.model<IGuestUser>('GuestUser', guestUserSchema);
