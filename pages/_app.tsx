import '../tailwind.css'

import { VisualEditing } from '@sanity/visual-editing/next-pages-router'
import { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import { stegaClean, toPlainText } from 'next-sanity'
import { useEffect, useState } from 'react'

import AnalyticsClient from '../components/AnalyticsClient'
import Layout from '../components/Layout'
import MetaHead from '../components/MetaHead'
import { getClient, getSettings } from '../lib/sanity.client'
import { Settings } from '../lib/sanity.queries'

export interface SharedPageProps {
  draftMode: boolean
  token: string
}

const PreviewProvider = dynamic(() => import('components/PreviewProvider'))

export default function App({
  Component,
  pageProps,
}: AppProps<SharedPageProps>) {
  const { draftMode, token } = pageProps
  const [settings, setSettings] = useState<Settings | null>(null)

  useEffect(() => {
    async function fetchSettings() {
      const client = getClient()
      const data = await getSettings(client)
      setSettings(data)
    }
    fetchSettings()
  }, [])

  const title = settings ? stegaClean(settings.title) : ''
  const description = settings ? toPlainText(settings.description) : ''

  const content = (
    <Layout title={title} description={description}>
      <Component {...pageProps} />
      <AnalyticsClient />
    </Layout>
  )

  return (
    <>
      {title && description && (
        <MetaHead title={title} description={description} site_name={title} />
      )}
      {draftMode ? (
        <PreviewProvider token={token}>{content}</PreviewProvider>
      ) : (
        content
      )}
      {draftMode && <VisualEditing />}
    </>
  )
}
