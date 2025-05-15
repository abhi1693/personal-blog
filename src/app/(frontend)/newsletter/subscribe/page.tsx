import SubscriberForm from '@/ui/SubscriberForm'

export default function SubscribePage() {
	return (
		<main className="py-24 px-4 max-w-md mx-auto">
			<h1 className="text-2xl font-bold mb-2">Join the Newsletter</h1>
			<p className="text-sm text-gray-600 mb-6">
				Get new posts, guides, and updates straight to your inbox.
			</p>
			<SubscriberForm showTitle={false} />
		</main>
	)
}
