import moduleProps, { ModuleScopedCss } from '@/lib/moduleProps'
import CTA from '@/ui/CTA'
import Pretitle from '@/ui/Pretitle'
import { PortableText } from 'next-sanity'

export default function FormModule({
	eyebrow,
	intro,
	form,
	...props
}: Partial<{
	eyebrow: string
	intro: any
	form: {
		identifier?: string
		endpoint?: string
	}
}> &
	Sanity.Module) {
	return (
		<section className="section grid items-start gap-8 md:grid-cols-2" {...moduleProps(props)}>
			<header className="richtext md:sticky-below-header [--offset:1rem]">
				<Pretitle>{eyebrow}</Pretitle>
				<PortableText value={intro} />
			</header>

			{form?.endpoint ? (
				<form className="grid gap-4" action={form.endpoint} method="POST">
					<label>
						<span>Name</span>
						<input
							className="w-full rounded border px-3 py-2"
							name="name"
							type="text"
							autoComplete="name"
						/>
					</label>
					<label>
						<span>Email</span>
						<input
							className="w-full rounded border px-3 py-2"
							name="email"
							type="email"
							autoComplete="email"
							required
						/>
					</label>
					<label>
						<span>Message</span>
						<textarea
							className="w-full rounded border px-3 py-2"
							name="message"
							rows={4}
						/>
					</label>
					<div>
						<button className="action" type="submit">
							Submit
						</button>
					</div>
				</form>
			) : (
				<CTA>Missing form endpoint</CTA>
			)}

			<ModuleScopedCss {...props} />
		</section>
	)
}
