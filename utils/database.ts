import mongoose, { InferSchemaType } from 'mongoose'


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
