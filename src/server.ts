import 'dotenv/config'
import express, { Request, Response } from 'express'
import z from 'zod'
import cors from 'cors'
import OpenAI from 'openai'
import { validateInput } from './validation'

const server = express()
const PORT = parseInt(process.env.PORT as string) || 8080

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
})

/**
 * START Zod schema stuff.
 * Create a zod schema which will be used when sanitizing the user input.
 */
const chatInputSchema = z.object({
  body: z.object({
    input: z
      .string({ required_error: 'Please provide a prompt.' })
      .min(2, 'Prompt must be at least 2 letters.')
    }
  )
})

type ChatInput = z.infer<typeof chatInputSchema>
/**
 * END Zod schema stuff.
 */


/**
 * Start Middleware
 */
server.use(cors())
server.use(express.json())
/**
 * End Middleware
 */


/**
 * Start API Routes
 */
server.get('/healthz', (_req, res) => {
  res.status(200).json({ msg: 'Health OK!' })
})

server.post('/api/v1/chat', validateInput(chatInputSchema), async (
  req: Request<{}, {}, ChatInput['body']>,
  res: Response
) => {
  try {
    const { input } = req.body
    const results = await client.responses.create({
      model: 'gpt-4o-mini',
      input
    })
    res.status(200).json(results.output_text)
  } catch (error) {
    if (error instanceof Error) {
      console.error('An error occurred.', error.message)
    }
    res.status(500).json({ msg: 'Internal Server Error.' })
  }
})
/**
 * End API Routes
 */


/**
 * Main function that starts the express server.
 */
function main(): void {
  server.listen(PORT, () => {
    console.log(`server started on http://localhost:${PORT}`)
  })
}

main()
