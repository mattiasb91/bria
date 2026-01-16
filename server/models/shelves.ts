'use strict';
import { Schema,model, Document, type InferSchemaType, Types} from "mongoose";

const shelfSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
}, {
  timestamps: true,
});

export type ShelfType = InferSchemaType<typeof shelfSchema>

export interface IShelf extends ShelfType, Document {
     userId: Types.ObjectId;
}
const Shelf = model<IShelf>('Shelf',shelfSchema);

export default Shelf;