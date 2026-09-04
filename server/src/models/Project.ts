import { Schema, model, type Document, type Model } from 'mongoose'

export interface IProject extends Document {
  title: string
  slug: string
  shortDescription: string
  longDescription: string
  objective: string
  problem: string
  solution: string
  architecture: string[]
  keyFeatures: string[]
  technologies: string[]
  images: string[]
  githubUrl: string
  liveUrl: string
  status: 'completed' | 'in-progress' | 'planned'
  featured: boolean
  difficulty: 'easy' | 'medium' | 'hard'
  missionNumber?: number
}

const projectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    shortDescription: { type: String, required: true },
    longDescription: { type: String, default: '' },
    objective: { type: String, default: '' },
    problem: { type: String, default: '' },
    solution: { type: String, default: '' },
    architecture: { type: [String], default: [] },
    keyFeatures: { type: [String], default: [] },
    technologies: { type: [String], default: [] },
    images: { type: [String], default: [] },
    githubUrl: { type: String, default: '' },
    liveUrl: { type: String, default: '' },
    status: {
      type: String,
      enum: ['completed', 'in-progress', 'planned'],
      default: 'planned',
    },
    featured: { type: Boolean, default: false },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    missionNumber: { type: Number },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

export const Project: Model<IProject> = model<IProject>('Project', projectSchema)