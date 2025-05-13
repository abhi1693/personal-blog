'use client'

import styles from './YouTubeEmbed.module.css'
import LiteYouTubeEmbed from 'react-lite-youtube-embed'
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'

interface YouTubeEmbedProps {
	videoId: string
	title: string
}

export default function YouTubeEmbed({ videoId, title }: YouTubeEmbedProps) {
	return (
		<div className={styles.wrapper}>
			<LiteYouTubeEmbed
				id={videoId}
				title={title}
				adNetwork={false}
				cookie={false}
				playerClass="lty-playbtn"
				wrapperClass="yt-lite"
			/>
		</div>
	)
}
