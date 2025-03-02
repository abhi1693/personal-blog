import MetaHead from './MetaHead'

interface SeriesHeadProps {
  title: string
  description: string
  imageUrl: string
  url: string
}

export default function SeriesHead({
  title,
  description,
  imageUrl,
  url,
}: SeriesHeadProps) {
  return (
    <MetaHead
      title={title}
      description={description}
      imageUrl={imageUrl}
      url={url}
    />
  )
}
