import { stegaClean } from 'next-sanity'

import { Settings } from '../lib/sanity.queries'
import MetaHead from './MetaHead'

interface SeriesHeadProps {
  title: string
  description: string
  imageUrl: string
  url: string
  settings?: Settings
}

export default function SeriesHead({
  title,
  description,
  imageUrl,
  url,
  settings,
}: SeriesHeadProps) {
  return (
    <MetaHead
      title={title}
      site_name={stegaClean(settings.title)}
      description={description}
      imageUrl={imageUrl}
      url={url}
    />
  )
}
