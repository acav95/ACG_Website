import fs from 'fs'
import path from 'path'

export const ensureDataDirectory = () => {
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
  
  // Ensure resources.json exists
  const resourcesPath = path.join(dataDir, 'resources.json')
  if (!fs.existsSync(resourcesPath)) {
    fs.writeFileSync(resourcesPath, '[]')
  }
  
  // Ensure thoughts.json exists
  const thoughtsPath = path.join(dataDir, 'thoughts.json')
  if (!fs.existsSync(thoughtsPath)) {
    fs.writeFileSync(thoughtsPath, '[]')
  }
} 