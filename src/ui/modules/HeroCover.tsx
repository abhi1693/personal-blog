import CustomHTML from './CustomHTML'
import moduleProps, { ModuleScopedCss } from '@/lib/moduleProps'
import { cn } from '@/lib/utils'
import CTAList from '@/ui/CTAList'
import { Img, Source } from '@/ui/Img'
import Pretitle from '@/ui/Pretitle'
import { PortableText, stegaClean } from 'next-sanity'

export default function HeroCover({
	eyebrow,
	content,
	ctas,
	image,
	textAlign: ta = 'center',
	verticalAlign: va = 'center',
	...props
}: Partial<{
	eyebrow: string
	content: any
	ctas: Sanity.CTA[]
	image: Sanity.Image & {
		mobile?: Sanity.Image
		opacity?: number
	}
	textAlign: 'left' | 'center' | 'right'
	verticalAlign: 'top' | 'center' | 'bottom'
}> &
	Sanity.Module) {
	const textAlign = stegaClean(ta)
	const verticalAlign = stegaClean(va)
	const opacity = Number(stegaClean(image?.opacity) ?? 1)

	return (
		<section
			className={cn(
				'relative grid min-h-[60svh] overflow-hidden *:col-span-full *:row-span-full',
				{
					'items-start': verticalAlign === 'top',
					'items-center': verticalAlign === 'center',
					'items-end': verticalAlign === 'bottom',
				},
			)}
			{...moduleProps(props)}
		>
			{image && (
				<picture className="contents">
					<Source image={image.mobile} width={1000} />
					<Img
						image={image}
						width={2400}
						className="pointer-events-none absolute inset-0 size-full object-cover"
						style={{ opacity }}
						alt={image.alt || ''}
						draggable={false}
					/>
				</picture>
			)}

			<header
				className={cn(
					'section richtext headings:text-balance relative isolate max-w-xl text-balance',
					image && opacity > 0.5 && 'text-canvas text-shadow',
					{
						'me-auto text-left': textAlign === 'left',
						'mx-auto text-center': textAlign === 'center',
						'ms-auto text-right': textAlign === 'right',
					},
				)}
			>
				<Pretitle className={cn(image && opacity > 0.5 && 'text-canvas/70')}>
					{eyebrow}
				</Pretitle>
				<PortableText
					value={content}
					components={{
						types: {
							'custom-html': ({ value }) => <CustomHTML {...value} />,
						},
					}}
				/>
				<CTAList
					ctas={ctas}
					className={cn('!mt-6', {
						'justify-start': textAlign === 'left',
						'justify-center': textAlign === 'center',
						'justify-end': textAlign === 'right',
					})}
				/>
			</header>

			<ModuleScopedCss {...props} />
		</section>
	)
}
