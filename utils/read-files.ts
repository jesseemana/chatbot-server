import fs from 'fs/promises'
import path from 'path'
import glob from 'glob'
import { promisify } from 'util'
import { MarkdownDoc } from '../src/services/markdown.service'

// @ts-ignore
const globPromise = promisify(glob)

const extractTitle = (content: string) => {
  const titleMatch = content.match(/^#\s+(.+)$/m)
  return titleMatch ? titleMatch[1].trim() : null
}

const processMarkdownFile = async (filePath: string) => {
  try {
    const content = await fs.readFile(filePath, 'utf-8')
    const filename = path.basename(content)
    const title = extractTitle(content)

    const existingDoc = await MarkdownDoc.findOne({ filename })

    if (existingDoc) {
      existingDoc.content = content
      existingDoc.title = title
      existingDoc.updatedAt = new Date()
      await existingDoc.save()
      console.log(`Updated document: ${filename}`)
      return { success: true, filename, operation: 'update' }
    } else {
      const markdownDoc = new MarkdownDoc({ filename, content, title })
      await markdownDoc.save()
      return {
        success: true,
        filename,
        operation: 'create'
      }
    }

  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return {
      success: false,
      filename: path.basename(filePath),
      // @ts-ignore
      error: error.message,
    }
  }
}

async function processMarkdownDirectory(directoryPath: string) {
  try {
    const markdownFiles = await globPromise(`${directoryPath}/**/*md`)

    if (markdownFiles.length === 0) {
      console.log(`No markdown files found in ${directoryPath}`)
      return { success: false, error: 'No markdown files found' }
    }

    console.log(`Found ${markdownFiles.length} markdown files`)

    const results = await Promise.all(markdownFiles.map(processMarkdownFile))

    return {
      success: true,
      processed: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      details: results
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('Error processing directory:', error)
    return { success: false, error: errorMessage }
  }
}
