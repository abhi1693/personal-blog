import Image from 'next/image'
import { KeyboardEvent, useMemo, useState } from 'react'

interface YouTubeEmbedProps {
  url: string
  thumbnailUrl: string
}

function extractVideoId(url: string): string | null {
  if (!url) return null
  const regex =
    /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  const match = url.match(regex)
  return match ? match[1] : null
}

export default function YouTubeEmbed({ url, thumbnailUrl }: YouTubeEmbedProps) {
  const [iframeVisible, setIframeVisible] = useState(false)
  const [iframeLoaded, setIframeLoaded] = useState(false)

  const videoId = useMemo(() => extractVideoId(url), [url])
  if (!videoId) return null

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setIframeVisible(true)
    }
  }

  return (
    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
      {!iframeVisible ? (
        <div
          role="button"
          tabIndex={0}
          onClick={() => setIframeVisible(true)}
          onKeyDown={handleKeyDown}
          className="absolute inset-0 cursor-pointer group"
        >
          <Image
            src={thumbnailUrl}
            alt="YouTube Thumbnail"
            fill
            style={{ objectFit: 'cover' }}
            quality={90}
            priority
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/80 transition-colors duration-300" />
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              className="bg-white rounded-full p-3 shadow transition-transform duration-200 transform group-hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
              aria-label="Play Video"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-black"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <iframe
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-300 ${
            iframeLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          frameBorder="0"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Embedded YouTube Video"
          onLoad={() => setIframeLoaded(true)}
        />
      )}
    </div>
  )
}
