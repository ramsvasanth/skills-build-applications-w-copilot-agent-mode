import mongoose from 'mongoose'

export const API_PORT = 8000
const mongoUrl = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/octofit_db'

export function getApiBaseUrl(): string {
  const codespaceName = process.env.CODESPACE_NAME
  return codespaceName
    ? `https://${codespaceName}-${API_PORT}.app.github.dev`
    : `http://localhost:${API_PORT}`
}

export async function connectToDatabase(): Promise<void> {
  await mongoose.connect(mongoUrl)
  console.log('Connected to MongoDB')
}
