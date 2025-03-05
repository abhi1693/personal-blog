import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface CoverImageProps {
  title: string
  slug?: string
  alt: string
  image: any
  priority?: boolean
  prefetch?: boolean
}

export default function CoverImage({
  title,
  slug,
  image: source,
  priority = false,
  alt,
  prefetch = false,
}: CoverImageProps) {
  // Ensure image URL is consistent across SSR and CSR
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    if (source?.asset?._ref) {
      setImageUrl(urlForImage(source).height(1000).width(2000).url())
    }
  }, [source])

  if (!imageUrl) {
    return <div style={{ paddingTop: '50%', backgroundColor: '#ddd' }} />
  }

  const imageElement = (
    <div className="shadow-small">
      <Image
        className="h-auto w-full"
        width={2000}
        height={1000}
        alt={alt}
        src={imageUrl}
        sizes="100vw"
        priority={priority}
      />
    </div>
  )

  return (
    <div className="sm:mx-0">
      {slug ? (
        <Link href={`/posts/${slug}`} aria-label={title} prefetch={prefetch}>
          {imageElement}
        </Link>
      ) : (
        imageElement
      )}
    </div>
  )
}
