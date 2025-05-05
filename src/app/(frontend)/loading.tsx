export default function Loading() {
	return (
		<main
			aria-busy="true"
			aria-label="Loading content…"
			className="max-w-6xl mx-auto px-4 py-8 space-y-10 animate-pulse"
		>
			{/* Hero Section */}
			<section className="grid md:grid-cols-2 gap-8 items-center">
				<div className="h-64 w-full bg-gray-200 rounded-xl" />
				<div className="space-y-4">
					<div className="h-6 w-3/4 bg-gray-300 rounded" />
					<div className="h-4 w-full bg-gray-200 rounded" />
					<div className="h-4 w-5/6 bg-gray-200 rounded" />
					<div className="h-3 w-1/3 bg-gray-300 rounded" />
				</div>
			</section>

			{/* Tag Filters */}
			<section className="flex gap-2 flex-wrap">
				{Array.from({ length: 5 }).map((_, i) => (
					<div key={i} className="h-6 w-24 rounded-full bg-gray-200" />
				))}
			</section>

			{/* Post Grid */}
			<section className="grid md:grid-cols-3 gap-6">
				{Array.from({ length: 3 }).map((_, i) => (
					<div key={i} className="border p-4 rounded-lg space-y-4">
						<div className="h-40 w-full rounded bg-gray-200" />
						<div className="h-4 w-3/4 bg-gray-300 rounded" />
						<div className="h-4 w-full bg-gray-200 rounded" />
					</div>
				))}
			</section>

			{/* Optional Quote */}
			<div className="pt-8 text-center text-base text-gray-600 font-medium italic border-t border-gray-200">
				Scaling infrastructure, one cluster at a time…
			</div>
		</main>
	)
}
