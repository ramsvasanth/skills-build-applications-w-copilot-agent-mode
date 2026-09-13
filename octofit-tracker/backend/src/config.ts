import mongoose from 'mongoose'

const mongoUrl = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/octofit_db'

export async function connectToDatabase(): Promise<void> {
  await mongoose.connect(mongoUrl)
  console.log('Connected to MongoDB')
}
