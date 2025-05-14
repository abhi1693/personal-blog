import Scheduler from './Scheduler'
import { fetchSanityLive } from '@/sanity/lib/fetch'
import { LINK_QUERY } from '@/sanity/lib/queries'
import CTA from '@/ui/CTA'
import { groq } from 'next-sanity'
import { PortableText } from 'next-sanity'

export default async function Announcement() {
	const announcements = await fetchSanityLive<
		(Sanity.Announcement & Sanity.Module)[]
	>({
		query: groq`*[_type == 'site'][0].announcements[]->{
			...,
			cta{ ${LINK_QUERY} },
		}`,
	})

	if (!announcements) return null

	return (
		<>
			{announcements?.map(({ start, end, content, cta, _id }) => (
				<Scheduler start={start} end={end} key={_id}>
					<aside
						id="announcement"
						className="bg-accent text-canvas flex flex-wrap items-center justify-center gap-x-4 md:gap-x-6 p-2 px-4 text-center text-balance max-md:text-sm overflow-x-hidden"
					>
						<div className="anim-fade-to-r [&_a]:link max-w-full min-w-0">
							<PortableText value={content} />
						</div>

						<CTA className="link anim-fade-to-l shrink-0" link={cta} />
					</aside>
				</Scheduler>
			))}
		</>
	)
}
