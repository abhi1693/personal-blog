import Content from './Content'
import moduleProps, { ModuleScopedCss } from '@/lib/moduleProps'
import { cn } from '@/lib/utils'

export default function RichtextModule({
	content,
	stretch,
	...props
}: Partial<{
	content: any
	stretch: boolean
}> &
	Sanity.Module) {
	return (
		<section className={cn('section grid gap-8')} {...moduleProps(props)}>
			<Content
				value={content}
				className={cn(stretch ? 'max-w-screen-lg' : 'max-w-screen-md')}
			/>
			<ModuleScopedCss {...props} />
		</section>
	)
}
