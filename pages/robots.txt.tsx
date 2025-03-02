import { getBaseUrl } from '../components/utils/getBaseUrl'

const BASE_URL = getBaseUrl()

const robotsTxt = `User-agent: *
Disallow: /studio

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
