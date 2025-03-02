export const getBaseUrl = (): string => {
  const prodUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  const vercelUrl = process.env.VERCEL_URL

  if (prodUrl) {
    return prodUrl.startsWith('http') ? prodUrl : `https://${prodUrl}`
  }

  if (vercelUrl) {
    return `https://${vercelUrl}`
  }

  return 'http://localhost:3000'
}
