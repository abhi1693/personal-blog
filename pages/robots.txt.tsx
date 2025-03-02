import { getProdUrl } from '../components/utils/getProdUrl'

const BASE_URL = getProdUrl()

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
