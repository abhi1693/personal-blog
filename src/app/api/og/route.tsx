import { BASE_URL } from '@/lib/env'
import { getSite } from '@/sanity/lib/queries'
import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

const domain = BASE_URL?.replace(/^https?:\/\//, '') ?? 'localhost:3000'

export async function GET(request: NextRequest) {
	const { searchParams } = request.nextUrl
	const site = await getSite()

	const rawTitle = searchParams.get('title') || site.title
	const regex = new RegExp(`\\s[-—|]+\\s${site.title}$`)
	const title = rawTitle.replace(regex, '').trim()

	const tagParam = searchParams.get('tags') || 'DevOps, Kubernetes, Automation'
	const tags = tagParam
		.split(',')
		.map((t) => t.trim())
		.filter(Boolean)

	return new ImageResponse(
		(
			<div
				style={{
					height: '100%',
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					alignItems: 'center',
					backgroundColor: 'white',
					backgroundImage:
						'radial-gradient(circle at 25px 25px, lightgray 2%, transparent 0%), radial-gradient(circle at 75px 75px, lightgray 2%, transparent 0%)',
					backgroundSize: '100px 100px',
					backgroundPosition: '0 0, 0 0',
					fontFamily: 'Inter, sans-serif',
				}}
			>
				{/* Title Section */}
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						padding: '2rem 4rem',
						flex: 1,
					}}
				>
					{/* Name */}
					<div
						style={{
							display: 'flex',
							fontSize: 60,
							fontWeight: 700,
							color: '#000',
							background: '#fff',
							padding: '10px 20px',
							borderRadius: '12px',
						}}
					>
						Abhimanyu Saharan
					</div>

					{/* Title as Subtext */}
					<div
						style={{
							display: 'flex',
							fontSize: 32, // Smaller than name
							fontWeight: 500,
							color: '#374151', // Tailwind slate-700
							background: '#fff',
							padding: '10px 20px',
							marginTop: 20,
							borderRadius: '12px',
							maxWidth: 1000,
							whiteSpace: 'pre-wrap',
							textAlign: 'center',
						}}
					>
						{title}
					</div>
				</div>

				{/* Footer */}
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'flex-end',
						width: '100%',
						padding: '0 4rem 2rem',
					}}
				>
					{/* Bottom-left: Domain */}
					<div
						style={{
							display: 'flex',
							fontSize: 18,
							color: '#666',
							fontFamily: 'Menlo, monospace',
						}}
					>
						{domain}
					</div>

					{/* Bottom-right: Tags */}
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							gap: '0.5rem',
							overflow: 'hidden',
							maxWidth: '60%',
							whiteSpace: 'nowrap',
						}}
					>
						{tags.map((tag, i) => (
							<div
								key={i}
								style={{
									display: 'flex',
									fontSize: 18,
									fontWeight: 600,
									padding: '4px 12px',
									borderRadius: 9999,
									backgroundColor: '#f1f5f9',
									color: '#1e293b',
									border: '1px solid #cbd5e1',
									textTransform: 'uppercase',
									letterSpacing: '0.04em',
									fontFamily: 'Inter, sans-serif',
								}}
							>
								#{tag}
							</div>
						))}
					</div>
				</div>
			</div>
		),
		{
			width: 1200,
			height: 630,
			fonts: [
				{
					name: 'Inter',
					data: await loadInterFont(),
					style: 'normal',
					weight: 600,
				},
			],
		},
	)
}

async function loadInterFont() {
	const cssUrl = 'https://fonts.googleapis.com/css2?family=Inter:wght@600'
	const css = await (await fetch(cssUrl)).text()
	const match = css.match(/src: url\(([^)]+)\) format\('(opentype|truetype)'\)/)

	if (match?.[1]) {
		const fontUrl = match[1].replace(/^url\(/, '').replace(/\)$/, '')
		const fontRes = await fetch(fontUrl)
		if (fontRes.ok) return await fontRes.arrayBuffer()
	}

	throw new Error('Failed to load Inter font')
}
