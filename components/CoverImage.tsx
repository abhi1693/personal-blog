import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'
import Link from 'next/link'

interface CoverImageProps {
  title: string
  slug?: string
  alt: string
  image: any
  priority?: boolean
  prefetch?: boolean
  loading?: 'eager' | 'lazy'
}

export default function CoverImage({
  title,
  slug,
  image: source,
  priority = false,
  alt,
  prefetch = false,
  loading = 'lazy',
}: CoverImageProps) {
  if (!source?.asset?._ref) {
    return <div style={{ paddingTop: '50%', backgroundColor: '#ddd' }} />
  }

  // Generate Image URLs
  const imageUrl = urlForImage(source)
    .format('webp')
    .height(1000)
    .width(2000)
    .url()
  const blurUrl = urlForImage(source)
    .format('webp')
    .width(50)
    .height(25)
    .blur(10)
    .url()

  // Reusable Image Component
  const imageElement = (
    <div className="relative w-full" style={{ aspectRatio: '2 / 1' }}>
      <Image
        className="absolute top-0 left-0 w-full h-full"
        width={2000}
        height={1000}
        alt={alt}
        src={imageUrl}
        sizes="100vw"
        priority={priority}
        placeholder={priority ? 'blur' : 'empty'}
        loading={loading}
        blurDataURL={priority ? blurUrl : undefined}
      />
    </div>
  )

  return slug ? (
    <Link href={`/posts/${slug}`} aria-label={title} prefetch={prefetch}>
      {imageElement}
    </Link>
  ) : (
    imageElement
  )
}
