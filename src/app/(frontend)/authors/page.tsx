import { BASE_URL } from '@/lib/env'
import { fetchSanityLive } from '@/sanity/lib/fetch'
import { IMAGE_QUERY } from '@/sanity/lib/queries'
import { Img } from '@/ui/Img'
import type { Metadata } from 'next'
import { groq } from 'next-sanity'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Authors',
  description: 'Browse all authors and contributors.',
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${BASE_URL}/authors`,
  },
}

export default async function AuthorsIndexPage() {
  const authors = await getAuthors()

  return (
    <main className="section space-y-8">
      <header className="space-y-2 text-center">
        <h1 className="h2">Authors</h1>
        <p className="text-gray-600">{authors.length} total</p>
      </header>

      {authors.length ? (
        <ul className="grid gap-8 sm:grid-cols-[repeat(auto-fill,minmax(240px,1fr))]">
          {authors.map((a) => (
            <li key={a._id} className="group">
              <a href={`/authors/${a.slug.current}`} className="block">
                <figure className="aspect-square overflow-hidden rounded-md bg-ink/5">
                  {a.image ? (
                    <Img
                      className="aspect-square w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                      image={a.image}
                      width={600}
                      alt={a.name}
                    />
                  ) : null}
                </figure>
                <h2 className="mt-3 text-lg font-medium text-gray-900 group-hover:underline">
                  {a.name}
                </h2>
                {(a.title || a.company) && (
                  <p className="text-sm text-gray-600">
                    {[a.title, a.company].filter(Boolean).join(' • ')}
                  </p>
                )}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No authors found.</p>
      )}
    </main>
  )
}

async function getAuthors() {
  return await fetchSanityLive<
    Array<{
      _id: string
      name: string
      slug: { current: string }
      title?: string
      company?: string
      image?: Sanity.Image
    }>
  >({
    query: groq`*[_type == 'person' && defined(slug.current)]|order(name asc){
      _id,
      name,
      slug,
      title,
      company,
      image { ${IMAGE_QUERY} }
    }`,
  })
}
