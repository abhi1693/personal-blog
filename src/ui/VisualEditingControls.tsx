import DraftModeControls from './DraftModeControls'
import { fetchSanityLive, SanityLive } from '@/sanity/lib/fetch'
import { groq, VisualEditing } from 'next-sanity'
import { draftMode } from 'next/headers'

export default async function VisualEditingControls() {
	const globalModules = await fetchSanityLive({
		query: groq`*[_type == 'global-module']{
			_id,
			path,
			excludePaths[]
		}`,
	})

	return (
		<>
			<SanityLive />

			{(await draftMode()).isEnabled && (
				<>
					<VisualEditing />
					<DraftModeControls globalModules={globalModules} />
				</>
			)}
		</>
	)
}
