export const getBaseUrl = (): string => {
  const prodUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  const vercelUrl = process.env.VERCEL_URL

  console.log('prodUrl', prodUrl, 'vercelUrl', vercelUrl)

  if (prodUrl) {
    return `https://${prodUrl}`
  }

  if (vercelUrl) {
    return `https://${vercelUrl}`
  }

  return 'http://localhost:3000' // Local fallback
}
