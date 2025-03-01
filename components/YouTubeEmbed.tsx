import type { YouTubeEmbed as YouTubeEmbedType } from 'lib/sanity.queries'

const extractVideoId = (url: string): string | null => {
  const regex =
    /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  const match = url.match(regex)
  return match ? match[1] : null
}

const YouTubeEmbed: React.FC<YouTubeEmbedType> = ({ url }) => {
  const videoId = extractVideoId(url)
  if (!videoId) return null

  return (
    <div className="flex justify-center">
      <iframe
        width="800"
        height="450"
        src={`https://www.youtube.com/embed/${videoId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Embedded YouTube Video"
      />
    </div>
  )
}

export default YouTubeEmbed
