import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from 'next-sanity'

import { urlForImage } from '../lib/sanity.image'

interface Series {
  _id: string
  title: string
  description: any[]
  slug: string
  coverImage?: { asset: { _ref: string } }
}

export default function SeriesList({ series }: { series: Series[] }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">All Series</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {series.map((s) => (
          <Link
            key={s._id}
            href={`/series/${s.slug}`}
            className="block group"
            prefetch={false}
          >
            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 transition transform hover:scale-105 hover:shadow-xl">
              {/* Image Section with Gradient Overlay */}
              <div className="relative">
                {s.coverImage?.asset?._ref && (
                  <Image
                    src={urlForImage(s.coverImage.asset._ref).url()}
                    alt={s.title}
                    width={500}
                    height={250}
                    className="w-full h-56 object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50"></div>
              </div>

              {/* Text Content */}
              <div className="p-5 flex flex-col justify-between min-h-[180px] pb-6">
                <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-500 transition">
                  {s.title}
                </h2>

                {/* Slightly reduced spacing between title & description */}
                <div className="text-gray-600 text-sm mt-2 line-clamp-4">
                  <PortableText value={s.description} />
                </div>

                {/* Read More Button */}
                <div className="mt-3">
                  <span className="text-blue-600 font-medium group-hover:underline">
                    Read More →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
