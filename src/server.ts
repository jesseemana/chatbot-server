import 'dotenv/config'
import express, { Request, Response } from 'express'
import OpenAI from 'openai'
import { validateInput } from './validation'
import { ChatInput, chatInput } from './schema'

const server = express()
const PORT = parseInt(process.env.PORT as string) || 8080

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string
})

server.use(express.json())

server.get('/healthz', (_req, res) => {
  res.status(200).json({ msg: 'Health OK!' })
})

server.post('/api/v1/chat', validateInput(chatInput), async (
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
    // @ts-expect-error error is not defined.
    console.error('An error occurred.', error.message)
    res.status(500).json({ msg: 'Something went wrong.' })
  }
})

function main() {
  server.listen(PORT, () => {
    console.log(`server started on http://localhost:${PORT}`)
  })
}

main()
