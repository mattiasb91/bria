import { Schema, model, Document,  type InferSchemaType, Types } from 'mongoose';


const userBookSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bookId: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  shelfIds: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Shelf',
    }],
    required: false,
    default: [],
  },
  progress: {
    type: Number,
    required: true,
    default: 0,
  },
  reads: {
    type: [{
      dateStarted: { type: Date, default: null },
      dateCompleted: { type: Date, default: null },
      rating: { type: Number, default: 0 },
      notes: { type: String, default: '' },
    }],
    required: false,
    default: [],
  },
  readCount: {
    type: Number,
    required: true,
    default: 0,
  },
  read: {
    type: Boolean,
    default: false,
  },
  owned: {
    type: Boolean,
    default: false,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['not reading', 'reading', 'read'],
    default: 'not reading',
  },
  format: {
    type: [{
      type: String,
      enum: ['', 'physical', 'kindle', 'audiobook']
    }],
    default: [''],
    required: false,
  }
}, {
  timestamps: true,
});


export type UserBookType = InferSchemaType<typeof userBookSchema>;

// This interface allows you to use mongoose-specific properties 
// and ensures userId/bookId are treated as ObjectIds
export interface IUserBook extends UserBookType, Document {
  userId: Types.ObjectId;
  bookId: Types.ObjectId;
  shelfIds: Types.ObjectId[];
}


const UserBook = model<IUserBook>('UserBook', userBookSchema);

export default UserBook;