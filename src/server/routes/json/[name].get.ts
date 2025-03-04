import { createReadStream } from 'fs'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  // @ts-expect-error
  const filePath = join('dist/json', event.context.params.name)
  
  return sendStream(event, createReadStream(filePath))
})

