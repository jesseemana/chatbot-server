import mongoose from 'mongoose'

export const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string, {
      dbName: 'Mark Down',
      maxPoolSize: 10,
    })
    console.log('Database Connected!!!')
  } catch (error) {
    console.error('Failed to connect to database.', error)
    process.exit(1)
  }
}

const markdownSchema = new mongoose.Schema({
  filename: {
    type: String,
    unique: true,
    required: true,
  },
  title: String,
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

export const MarkdownDoc = mongoose.model('MarkdownDoc', markdownSchema)
