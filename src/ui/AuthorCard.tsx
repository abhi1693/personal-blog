import { cn } from '@/lib/utils'
import Authors from '@/ui/modules/blog/Authors'

export default function AuthorCard({
	authors,
	className,
}: {
	authors?: Sanity.Person[]
	className?: string
}) {
	if (!authors?.length) return null
	return (
		<div className={cn('rounded-md border bg-accent/3 p-3', className)}>
			<Authors authors={authors.slice(0, 1)} linked className="gap-3" />
		</div>
	)
}
