import { GetStaticPaths, GetStaticProps } from 'next'
import {toPlainText} from "next-sanity";

import Breadcrumbs from '../../components/Breadcrumbs'
import SeriesHead from '../../components/SeriesHead'
import SeriesHeader from '../../components/SeriesHeader'
import SeriesPostGrid from '../../components/SeriesPostGrid'
import { getProdUrl } from '../../components/utils/getProdUrl'
import { getAllSeries, getSeriesBySlug } from '../../lib/sanity.client'
import { urlForImage } from '../../lib/sanity.image'

interface SeriesPageProps {
  series: {
    title: string
    description: any[]
    coverImage: { asset: { _ref: string } }
    posts: {
      _id: string
      title: string
      slug: string
      excerpt?: string
      date?: string
      coverImage?: { asset: { _ref: string } }
    }[]
  }
}

export default function SeriesPage({ series }: SeriesPageProps) {
  const seriesUrl = typeof window !== 'undefined' ? window.location.href : ''
  const imageUrl = urlForImage(series.coverImage.asset._ref).url()

  return (
    <>
      <SeriesHead
        title={series.title}
        description={toPlainText(series.description)}
        imageUrl={imageUrl}
        url={seriesUrl}
      />

      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs
          links={[
            { label: 'Series', href: '/series' },
            { label: series.title },
          ]}
        />
        <SeriesHeader
          title={series.title}
          postCount={series.posts.length}
          shareUrl={seriesUrl}
        />
        <SeriesPostGrid posts={series.posts} />
      </div>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const series = await getAllSeries()
  return {
    paths: series.map((s) => ({ params: { slug: s.slug } })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const series = await getSeriesBySlug(params?.slug as string)
  return { props: { series }, revalidate: 10 }
}
