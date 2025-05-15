import z from 'zod'

// The Zod schema definition
export const chatSchema = z.object({
  body: z.object({
    input: z
      .string({
        required_error: 'Please provide a prompt.'
      })
      .min(2, 'Prompt must be at least 2 letters.')
    }
  ),
})

export const fileSchema = z.object({
  body: z.object({
    file: z.instanceof(File, {
      message: 'File attachment is required.'
    })
  })
})

export type FileInput = z.infer<typeof fileSchema>
export type ChatInput = z.infer<typeof chatSchema>
