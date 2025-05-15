import 'dotenv/config'
import express, { Request, Response } from 'express'
import cors from 'cors'
import z from 'zod'
import OpenAI from 'openai'
import fs from 'fs'
import pdf from 'pdf-parse'
import { validateInput } from './middleware/validation'
import { connectDatabase } from '../utils/database'
import { upload } from './middleware/upload'
import { savePDFDocument } from './services/pdf.service'

const server = express()
const PORT = parseInt(process.env.PORT as string) || 8080

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
})

// The Zod schema definition
const chatInputSchema = z.object({
  body: z.object({
    input: z
      .string({
        required_error: 'Please provide a prompt.'
      })
      .min(2, 'Prompt must be at least 2 letters.')
    }
  )
})

type ChatInput = z.infer<typeof chatInputSchema>

// Start Middleware
server.use(cors())
server.use(express.json())

// Health Check
server.get('/healthz', (_req, res) => {
  res.status(200).json({ msg: 'Health OK!' })
})

server.post('/api/v1/upload', upload.single('file'), async (
  req: Request,
  res: Response
) => {
  try {
    const file = req.file

    fs.readFile(`./uploads/${file?.filename}`, (err, pdfBuffer) => {
      if (err) console.error('Error reading file:', err.message)
      pdf(pdfBuffer).then(async data => {
        console.log(data.text)
        const results = await savePDFDocument({ content: 'Hello world.' })
        res.status(200).json({ txt: results })
      })
    })
  } catch (error) {
    if (error instanceof Error) {
      console.error('An error occurred.', error.message)
    }
    res.status(500).json({ msg: 'Internal Server Error.' })
  }
})

server.post('/api/v1/chat', validateInput(chatInputSchema), async (
  req: Request<{}, {}, ChatInput['body']>,
  res: Response
) => {
  try {
    const { input } = req.body

    const results = await client.responses.create({
      model: 'chatgpt-4o-latest',
      input,
      // stream: true
    })

    // const stream = new ReadableStream({
    //   async start(controller) {
    //     for await (const chunk of results) {
    //       if (
    //         chunk.type === 'response.output_text.delta' &&
    //         chunk.delta
    //       ) {
    //         controller.enqueue(new TextEncoder().encode(chunk.delta))
    //       }
    //     }

    //     controller.close()
    //   }
    // })

    // return new Response(stream, {
    //   headers: {
    //     Connection: 'Keep-Alive',
    //     'Content-Encoding': 'none',
    //     'Cache-Control': 'no-cache, no-transform',
    //     'Content-Type': 'text/event-stream; charset=utf-8',
    //   }
    // })

    res.status(200).json(results.output_text)
  } catch (error) {
    if (error instanceof Error) {
      console.error('An error occurred.', error.message)
    }
    res.status(500).json({ msg: 'Internal Server Error.' })
  }
})

/**
 * Main function that starts the express server.
 */
function main(): void {
  server.listen(PORT, async () => {
    await connectDatabase()
    console.log(`server started on http://localhost:${PORT}`)
  })
}

main()
