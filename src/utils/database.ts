import mongoose from 'mongoose'

export const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string, {
      dbName: 'GuideBook',
      maxPoolSize: 10,
      autoIndex: false,
    })
    console.log('Database Connected!!!')
  } catch (error) {
    console.error('Failed to connect to database.', error)
    process.exit(1)
  }
}
