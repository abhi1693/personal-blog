'use client'

import LiteYouTubeEmbed from 'react-lite-youtube-embed'
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'

interface YouTubeEmbedProps {
	videoId: string
	title: string
}

export default function YouTubeEmbed({ videoId, title }: YouTubeEmbedProps) {
	return (
		<>
			<LiteYouTubeEmbed
				id={videoId}
				title={title}
				adNetwork={false}
				cookie={false}
			/>
		</>
	)
}
