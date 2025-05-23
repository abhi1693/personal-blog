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
						className="bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-400 text-white relative overflow-hidden shadow-md transition-all duration-300 ease-in-out animate-in fade-in slide-in-from-top-4"
					>
						<div className="flex flex-wrap items-center justify-center gap-x-4 md:gap-x-6 p-2 px-4 text-center text-balance max-md:text-sm w-full">
							<div className="max-w-full min-w-0 text-white [&_a]:underline [&_a:hover]:text-yellow-200 animate-fade-in">
								<PortableText value={content} />
							</div>
							<CTA
								className="ml-2 px-4 py-2 text-sm font-semibold bg-white text-black rounded hover:bg-yellow-200 transition-all duration-200 anim-fade-to-l shrink-0"
								link={cta}
							/>
						</div>
					</aside>
				</Scheduler>
			))}
		</>
	)
}
