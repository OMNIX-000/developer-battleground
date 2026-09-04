import { Schema, model, type Document, type Model } from 'mongoose'

export interface ISkill extends Document {
  name: string
  category: string
  level: number
  description: string
  icon: string
  rarity: string
}

const skillSchema = new Schema<ISkill>(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    level: { type: Number, required: true, min: 1, max: 10, default: 5 },
    description: { type: String, default: '' },
    icon: { type: String, default: 'code' },
    rarity: {
      type: String,
      enum: ['COMMON', 'RARE', 'EPIC', 'LEGENDARY'],
      default: 'COMMON',
    },
  },
  { timestamps: true, versionKey: false },
)

export const Skill: Model<ISkill> = model<ISkill>('Skill', skillSchema)