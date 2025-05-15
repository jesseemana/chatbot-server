import mongoose, { InferSchemaType } from 'mongoose'

export type DocumentType = InferSchemaType<typeof documentSchema>

const documentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  }
})

export async function savePDFDocument(data: DocumentType) {
  const pdf_doc = await PDFDocument.create(data)
  return pdf_doc
}

export const PDFDocument = mongoose.model('PDFDocument', documentSchema)
