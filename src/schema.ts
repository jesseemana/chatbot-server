import z from 'zod'

export const chatInput = z.object({
  body: z.object({
    input: z
      .string({ required_error: 'Prompt cannot be empty.' })
      .min(2, 'Prompt must be at least 2 letters.')
    })
})

export type ChatInput = z.infer<typeof chatInput>
