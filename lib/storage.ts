export function ensureDataDirectory() {
  const fs = require('fs')
  const path = require('path')
  const dataDir = path.join(process.cwd(), 'data')
  
  // Create data directory if it doesn't exist
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir)
  }
  
  // Create initial thoughts.json if it doesn't exist
  const thoughtsPath = path.join(dataDir, 'thoughts.json')
  if (!fs.existsSync(thoughtsPath)) {
    fs.writeFileSync(thoughtsPath, '[]')
  }

  // Create initial resources.json if it doesn't exist
  const resourcesPath = path.join(dataDir, 'resources.json')
  if (!fs.existsSync(resourcesPath)) {
    fs.writeFileSync(resourcesPath, '[]')
  }
} 