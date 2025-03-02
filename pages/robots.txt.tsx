const BASE_URL =
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000')

const robotsTxt = `User-agent: *
Disallow: /studio
Disallow: /api

Sitemap: ${BASE_URL}/sitemap.xml
`

export async function getServerSideProps({ res }) {
  res.setHeader('Content-Type', 'text/plain')
  res.write(robotsTxt)
  res.end()
  return { props: {} }
}

export default function RobotsTxt() {
  return null
}
