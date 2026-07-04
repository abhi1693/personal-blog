import Content from './Content'
import moduleProps, { ModuleScopedCss } from '@/lib/moduleProps'
import { cn } from '@/lib/utils'
import Sidebar from '@/ui/Sidebar'
import type { ToCHeadings } from '@/ui/table-of-contents'

export default function RichtextModule({
	content,
	stretch,
	sidebar,
	headings,
	...props
}: Partial<{
	content: any
	stretch: boolean
	sidebar: Sanity.Sidebar
	headings: ToCHeadings
}> &
	Sanity.Module) {
	const hasSidebar = !!sidebar?.position && !!sidebar.modules?.length

	return (
		<section
			className={cn(
				'section gap-8',
				hasSidebar
					? 'flex max-md:flex-col md:items-start'
					: 'grid',
			)}
			{...moduleProps(props)}
		>
			<Sidebar headings={headings ?? null} {...sidebar} />
			<Content
				value={content}
				className={cn(stretch ? 'max-w-screen-lg' : 'max-w-screen-md')}
			/>
			<ModuleScopedCss {...props} />
		</section>
	)
}
