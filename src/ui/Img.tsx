import { urlFor } from '@/sanity/lib/image'
import { getImageDimensions } from '@sanity/asset-utils'
import type { ImageUrlBuilderOptionsWithAliases } from '@sanity/image-url'
import { stegaClean } from 'next-sanity'
import NextImage, { getImageProps, type ImageProps } from 'next/image'
import type { ComponentProps } from 'react'
import { preload } from 'react-dom'

type ImgProps = {
	alt?: string
	imageOptions?: Partial<ImageUrlBuilderOptionsWithAliases>
} & Omit<ImageProps, 'src' | 'alt'>

export function Img({
	image,
	width,
	height,
	imageOptions,
	...props
}: { image?: Sanity.Image } & ImgProps) {
	if (!image?.asset) return null

	const dimensions = getFinalDimensions(image, width, height)
	const src = generateUrl(image, dimensions.width, dimensions.height, imageOptions)

	const loading = stegaClean(props.loading || image.loading) || 'lazy'
	const lqip = getLqip(image)

	return (
		<NextImage
			src={src}
			width={dimensions.width}
			height={dimensions.height}
			alt={props.alt || image.alt || ''}
			loading={loading}
			{...(loading === 'eager'
				? { priority: true, fetchPriority: 'high' as const }
				: {})}
			sizes={props.sizes || `(min-width: 640px) ${dimensions.width}px, 100vw`}
			placeholder={lqip ? 'blur' : undefined}
			blurDataURL={lqip}
			{...props}
		/>
	)
}

export function Source({
	image,
	media = '(width < 48rem)',
	width,
	height,
	options,
	...props
}: {
	image?: Sanity.Image
	options?: Partial<ImageUrlBuilderOptionsWithAliases>
} & ComponentProps<'source'>) {
	if (!image?.asset) return null

	const dimensions = getFinalDimensions(image, width, height)
	const src = generateUrl(image, dimensions.width, dimensions.height, options)
	const { props: imageProps } = getImageProps({
		src,
		width: dimensions.width,
		height: dimensions.height,
		alt: '',
	})

	if (stegaClean(image.loading) === 'eager') {
		preload(imageProps.src, { as: 'image' })
	}

	return (
		<source
			srcSet={imageProps.srcSet}
			width={imageProps.width}
			height={imageProps.height}
			media={media}
			{...props}
		/>
	)
}

export function ResponsiveImg({
	img,
	pictureProps,
	...props
}: {
	img?: Sanity.Img
	pictureProps?: ComponentProps<'picture'>
} & ImgProps) {
	if (!img) return null

	const { responsive, ...imgProps } = img

	return (
		<picture {...pictureProps}>
			{responsive?.map((r, key) => (
				<Source {...r} key={key} />
			))}
			<Img {...imgProps} {...props} />
		</picture>
	)
}

function getFinalDimensions(
	image: Sanity.Image,
	width?: number | `${number}` | string,
	height?: number | `${number}` | string,
) {
	const dimensions = getImageDimensions(image)
	const sourceWidth = (image.hotspot?.width ?? 1) * dimensions.width
	const sourceHeight = (image.hotspot?.height ?? 1) * dimensions.height

	const finalWidth = width
		? Number(width)
		: height
			? Math.round((Number(height) * sourceWidth) / sourceHeight)
			: Math.round(sourceWidth)

	const finalHeight = height
		? Number(height)
		: width
			? Math.round((Number(width) * sourceHeight) / sourceWidth)
			: Math.round(sourceHeight)

	return {
		width: finalWidth,
		height: finalHeight,
	}
}

function generateUrl(
	image: Sanity.Image,
	width: number,
	height: number,
	options?: Partial<ImageUrlBuilderOptionsWithAliases>,
) {
	return urlFor(image)
		.withOptions({
			width,
			height,
			auto: 'format',
			q: 75,
			...options,
		})
		.url()
}

function getLqip(image: Sanity.Image) {
	if (image.lqip) return image.lqip

	const asset = image.asset as {
		metadata?: {
			lqip?: string
		}
	}

	return asset.metadata?.lqip
}
