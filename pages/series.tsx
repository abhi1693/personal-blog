import { GetStaticProps } from 'next'

import SeriesList from '../components/SeriesList'
import { getAllSeries } from '../lib/sanity.client'

export default function SeriesPage({ series }: { series: any[] }) {
  return <SeriesList series={series} />
}

export const getStaticProps: GetStaticProps = async () => {
  const series = await getAllSeries()
  return { props: { series }, revalidate: 10 }
}
