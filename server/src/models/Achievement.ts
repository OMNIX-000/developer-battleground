import { Schema, model, type Document, type Model } from 'mongoose'

export interface IAchievement extends Document {
  title: string
  description: string
  icon: string
  xpReward: number
  unlocked: boolean
}

const achievementSchema = new Schema<IAchievement>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    icon: { type: String, default: 'award' },
    xpReward: { type: Number, default: 500 },
    unlocked: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
)

export const Achievement: Model<IAchievement> = model<IAchievement>(
  'Achievement',
  achievementSchema,
)