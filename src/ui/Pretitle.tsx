import { cn } from '@/lib/utils'
import { stegaClean } from 'next-sanity'

export default function Pretitle({
	className,
	children,
}: React.ComponentProps<'p'>) {
	if (!children) return null

	return (
		<h2 className={cn('technical text-ink/65', className)}>
			{stegaClean(children)}
		</h2>
	)
}
