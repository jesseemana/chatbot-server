import 'dotenv/config'
import express, { Request, Response } from 'express'
import cors from 'cors'
import OpenAI from 'openai'
import fs from 'fs'
import pdf from 'pdf-parse'
import { connectDatabase } from './utils/database'
import { savePDFAsText } from './services/pdf.service'
import { chatSchema, ChatInput } from './utils/schema'
import { upload } from './middleware/upload'
import { validateInput } from './middleware/validation'

const server = express()

const PORT: number = parseInt(process.env.PORT as string) || 8080
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
})

// Start Middleware
server.use(cors())
server.use(express.json())

// Health Check
server.get('/healthz', (_req, res) => {
  res.status(200).json({ msg: 'Health OK!' })
})

// PDF Upload route
server.post(
  '/api/v1/upload',
  upload.single('file'),
  async (req: Request, res: Response) => {
    try {
      const file = req.file
      fs.readFile(`./uploads/${file?.filename}`, (err, pdfBuffer) => {
        if (err) console.error('Error reading file:', err.message)
        pdf(pdfBuffer).then(async (data) => {
          const pdf_text = await savePDFAsText({ content: data.text })
          res.status(201).json({ pdf_text })
        })
      })
    } catch (error) {
      if (error instanceof Error) {
        console.error('An error occurred.', error.message)
      }
      res.status(500).json({ msg: 'Internal Server Error.' })
    }
  }
)

// Chat with OpenAI API route
server.post(
  '/api/v1/chat',
  validateInput(chatSchema),
  async (req: Request<{}, {}, ChatInput['body']>, res: Response) => {
    try {
      const { input } = req.body

      const results = await client.responses.create({
        model: 'chatgpt-4o-latest',
        input,
      })

      res.status(200).json(results.output_text)
    } catch (error) {
      if (error instanceof Error) {
        console.error('An error occurred.', error.message)
      }
      res.status(500).json({ msg: 'Internal Server Error.' })
    }
  }
)

/**
 * Main function that starts the express server.
 */
function main(): void {
  // TODO: add graceful shutdowns in the future.
  server.listen(PORT, async () => {
    await connectDatabase()
    console.log(`server started on http://localhost:${PORT}`)
  })
}

main()
