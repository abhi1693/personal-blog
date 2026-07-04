import SearchForm from './SearchForm'
import type { SearchScope } from './store'
import moduleProps, { ModuleScopedCss } from '@/lib/moduleProps'
import CTAList from '@/ui/CTAList'
import Pretitle from '@/ui/Pretitle'
import { PortableText, stegaClean } from 'next-sanity'
import { Suspense } from 'react'

export default function SearchModule({
	pretitle,
	intro,
	ctas,
	scope,
	path,
	...props
}: Partial<{
	pretitle: string
	intro: any
	ctas: Sanity.CTA[]
	scope: SearchScope
	path: string
}>) {
	return (
		<section className="section space-y-8" {...moduleProps(props)}>
			{(pretitle || intro) && (
				<header className="richtext text-center">
					<Pretitle>{pretitle}</Pretitle>
					<PortableText value={intro} />
				</header>
			)}

			<div className="mx-auto max-w-screen-sm">
				<Suspense fallback={<div className="skeleton-[calc(1lh+.5rem+2px)]" />}>
					<SearchForm scope={stegaClean(scope)} path={stegaClean(path)} />
				</Suspense>
			</div>

			<CTAList className="justify-center" ctas={ctas} />
			<ModuleScopedCss {...props} />
		</section>
	)
}
