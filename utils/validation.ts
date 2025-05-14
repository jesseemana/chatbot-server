import { NextFunction, Request, Response } from 'express'
import { AnyZodObject } from 'zod'

export const validateInput = (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    })
    next()
  } catch (err: any) {
    res.status(400).send(err.errors)
  }
}
