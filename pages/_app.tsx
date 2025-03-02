import '../tailwind.css'

import { VisualEditing } from '@sanity/visual-editing/next-pages-router'
import { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

import Layout from '../components/Layout'
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

  return (
    <>
      {draftMode ? (
        <PreviewProvider token={token}>
          {settings ? (
            <Layout
              title={settings.title || ''}
              description={settings.description?.[0] || ''}
            >
              <Component {...pageProps} />
            </Layout>
          ) : null}
        </PreviewProvider>
      ) : settings ? (
        <Layout
          title={settings.title || ''}
          description={settings.description?.[0] || ''}
        >
          <Component {...pageProps} />
        </Layout>
      ) : null}
      {draftMode && <VisualEditing />}
    </>
  )
}
