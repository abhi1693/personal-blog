import ShareOptions from './ShareOptions'

interface SeriesHeaderProps {
  title: string
  postCount: number
  shareUrl: string
}

export default function SeriesHeader({
  title,
  postCount,
  shareUrl,
}: SeriesHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-2xl font-bold">
        {title} ({postCount} {postCount === 1 ? 'Post' : 'Posts'})
      </h1>
      <ShareOptions url={shareUrl} title={title} />
    </div>
  )
}
