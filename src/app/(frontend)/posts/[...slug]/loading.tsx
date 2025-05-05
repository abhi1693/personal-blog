export default function BlogPostLoading() {
	return (
		<main
			aria-busy="true"
			aria-label="Loading blog post…"
			className="max-w-5xl mx-auto px-4 py-12 animate-pulse"
		>
			{/* Breadcrumb */}
			<div className="h-4 w-1/4 bg-gray-200 rounded mb-8" />

			{/* Title */}
			<div className="h-8 w-3/4 bg-gray-300 rounded mb-4" />

			{/* Metadata */}
			<div className="flex items-center space-x-4 text-sm text-gray-400 mb-8">
				<div className="h-4 w-16 bg-gray-200 rounded" />
				<div className="h-4 w-20 bg-gray-200 rounded" />
				<div className="h-4 w-24 bg-gray-200 rounded" />
				<div className="h-8 w-8 bg-gray-300 rounded-full" />
			</div>

			{/* Content + Sidebar layout */}
			<div className="grid md:grid-cols-[2fr_1fr] gap-12">
				{/* Main content */}
				<div className="space-y-6">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={i} className="space-y-3">
							<div className="h-4 w-5/6 bg-gray-200 rounded" />
							<div className="h-4 w-full bg-gray-200 rounded" />
							<div className="h-4 w-4/5 bg-gray-200 rounded" />
						</div>
					))}
				</div>

				{/* Sidebar */}
				<aside className="space-y-6">
					<div>
						<div className="h-5 w-32 bg-gray-300 rounded mb-3" />
						{Array.from({ length: 4 }).map((_, i) => (
							<div key={i} className="h-4 w-5/6 bg-gray-200 rounded mb-2" />
						))}
					</div>

					<div className="h-5 w-32 bg-gray-300 rounded mt-8 mb-2" />
					<div className="flex gap-3">
						{Array.from({ length: 4 }).map((_, i) => (
							<div key={i} className="h-8 w-8 bg-gray-200 rounded-full" />
						))}
					</div>
				</aside>
			</div>
		</main>
	)
}
