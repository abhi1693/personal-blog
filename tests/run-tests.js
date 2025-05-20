const fs = require('fs')
const path = require('path')

const distDir = path.join(__dirname, 'dist/tests')

if (!fs.existsSync(distDir)) {
  console.error('No compiled tests found. Run "npm run build:test" first.')
  process.exit(1)
}

const files = fs.readdirSync(distDir).filter(f => f.endsWith('.test.js'))
for (const file of files) {
  console.log(`Running ${file}`)
  try {
    require(path.join(distDir, file))
  } catch (err) {
    console.error(`Error in ${file}`)
    console.error(err)
    process.exitCode = 1
  }
}
if (!process.exitCode) {
  console.log('All tests passed')
}

