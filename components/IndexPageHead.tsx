import { Settings } from 'lib/sanity.queries'
import { stegaClean, toPlainText } from 'next-sanity'

import MetaHead from './MetaHead'
import { getProdUrl } from './utils/getProdUrl'
import WebsiteSchemaMarkup from './WebsiteSchemaMarkup'

export interface IndexPageHeadProps {
  settings: Settings
}

export default function IndexPageHead({ settings }: IndexPageHeadProps) {
  const { title, description, ogImage } = settings
  const ogImageTitle = ogImage.title
  const imageUrl = `${getProdUrl()}/api/og?${new URLSearchParams({ title: ogImageTitle })}`

  return (
    <MetaHead
      title={stegaClean(title)}
      description={toPlainText(description)}
      imageUrl={imageUrl}
    >
      <WebsiteSchemaMarkup settings={settings}></WebsiteSchemaMarkup>
    </MetaHead>
  )
}
