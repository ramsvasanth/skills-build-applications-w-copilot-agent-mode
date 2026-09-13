import cors from 'cors'
import express, { type ErrorRequestHandler } from 'express'
import { connectToDatabase } from './config.js'
import { apiRouter } from './routes.js'

const app = express()
const port = Number(process.env.PORT ?? 8000)

app.use(cors())
app.use(express.json())

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', database: 'octofit_db' })
})

app.use('/api', apiRouter)

const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  console.error(error)
  response.status(400).json({ error: 'The request could not be completed.' })
}

app.use(errorHandler)

async function startServer(): Promise<void> {
  await connectToDatabase()
  app.listen(port, () => {
    console.log(`OctoFit API listening on port ${port}`)
  })
}

startServer().catch((error: unknown) => {
  console.error('Unable to start OctoFit API', error)
  process.exitCode = 1
})
