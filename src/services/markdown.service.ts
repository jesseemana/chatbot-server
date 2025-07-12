import mongoose, { InferSchemaType } from 'mongoose'

const markdownSchema = new mongoose.Schema({
  filename: {
    type: String,
    unique: true,
    required: true,
  },
  title: String,
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

export const MarkdownDoc = mongoose.model('MarkdownDoc', markdownSchema)
