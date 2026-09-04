import { Schema, model, type Document, type Model } from 'mongoose'

export interface IMessage extends Document {
  name: string
  email: string
  message: string
  status: 'new' | 'read' | 'archived'
}

const contactMessageSchema = new Schema<IMessage>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ['new', 'read', 'archived'],
      default: 'new',
    },
  },
  { timestamps: true, versionKey: false },
)

export const ContactMessage: Model<IMessage> = model<IMessage>(
  'ContactMessage',
  contactMessageSchema,
)