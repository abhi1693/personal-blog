'use client'

import Giscus from '@giscus/react'

export default function Comments() {
	return (
		<Giscus
			id="comments"
			repo="abhi1693/personal-blog-discussions"
			repoId="R_kgDOO6in5Q"
			category="Announcements"
			categoryId="DIC_kwDOO6in5c4CrZ8f"
			mapping="url"
			strict="0"
			reactionsEnabled="1"
			inputPosition="top"
			theme="preferred_color_scheme"
			lang="en"
			loading="lazy"
		/>
	)
}
