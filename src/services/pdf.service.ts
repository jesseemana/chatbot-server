import mongoose, { InferSchemaType } from 'mongoose'

type DocumentType = InferSchemaType<typeof pdfSchema>

const pdfSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
})

export async function savePDFAsText(data: DocumentType) {
  const pdf_doc = await PDFDocument.create(data)
  return pdf_doc
}

export const PDFDocument = mongoose.model('UploadedPDF', pdfSchema)
