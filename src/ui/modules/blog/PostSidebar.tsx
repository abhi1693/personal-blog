import Categories from './Categories'
import SubscriberForm from '@/ui/SubscriberForm'
import BookPromo from '@/ui/modules/blog/BookPromo'

export default function PostSidebar({ post }: { post: Sanity.BlogPost }) {
	return (
		<aside className="lg:sticky-below-header mx-auto w-full max-w-lg self-start [--offset:1rem] lg:order-1 lg:w-3xs">
			<>
				<BookPromo authors={post.authors} />

				<div className="my-6 border-t border-gray-200" />

				{/* Patreon CTA */}
				<div className="space-y-2 text-sm text-gray-700">
					<p>Enjoying the content? Become a patron to support the work.</p>
					<a
						href="https://www.patreon.com/asaharan?utm_source=blog&utm_medium=sidebar&utm_campaign=patreon_cta"
						target="_blank"
						rel="noopener noreferrer"
						className="inline-block rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
					>
						Support on Patreon
					</a>
				</div>

				<div className="my-6 border-t border-gray-200" />

				<SubscriberForm />

				<div className="my-6 border-t border-gray-200" />

				{/* Categories at the bottom */}
				{!!post.categories?.length && (
					<div className="pt-2">
						<Categories
							className="flex flex-wrap gap-2"
							categories={post.categories}
							linked
						/>
					</div>
				)}
			</>
		</aside>
	)
}
