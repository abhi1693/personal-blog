import type { YouTubeEmbed as YouTubeEmbedType } from 'lib/sanity.queries'

const extractVideoId = (url: string): string | null => {
  if (!url) return null
  const regex =
    /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  const match = url.match(regex)
  return match ? match[1] : null
}

const YouTubeEmbed: React.FC<YouTubeEmbedType> = ({ url }) => {
  if (!url) return null

  const videoId = extractVideoId(url)
  if (!videoId) return null

  return (
    <div className="flex justify-center">
      <div className="relative w-full max-w-full md:max-w-3xl aspect-[16/9] md:aspect-[16/8]">
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Embedded YouTube Video"
        />
      </div>
    </div>
  )
}

export default YouTubeEmbed
