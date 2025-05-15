import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
  destination: function(_req, _file, cb) {
    cb(null, 'uploads/')
  },
  filename: function(_req, file, cb) {
    cb(null, `Doc${'-'}${Date.now() + path.extname(file.originalname)}`)
  }
})

export const upload = multer({ storage: storage })
