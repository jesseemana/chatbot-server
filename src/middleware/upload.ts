import multer, { FileFilterCallback } from 'multer'
import path from 'path'
import fs from 'fs-extra'
import { Request } from 'express'

const storage = multer.diskStorage({
  destination: function(
    _req: Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) {
    const uploadDir = 'uploads'
    fs.ensureDirSync(uploadDir)
    cb(null, uploadDir)
  },
  filename: function(_req, file, cb) {
    cb(null, `Doc${'-'}${Date.now() + path.extname(file.originalname)}`)
  }
})

const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (file.fieldname === 'file') {
    const allowedFileTypes = /pdf/
    const extension = path.extname(file.originalname).toLowerCase()
    const isAllowed = allowedFileTypes.test(extension)
    if (!isAllowed) {
      // @ts-ignore
      return cb(new Error('File type not allowed for attachment!'), false)
    }
  }
  cb(null, true)
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 },
})
