import { createClient } from '@sanity/client'
import { ImageResponse } from '@vercel/og'
import { apiVersion, dataset, projectId } from 'lib/sanity.api'
import type { NextRequest, NextResponse } from 'next/server'

export const config = { runtime: 'edge' }

import { height, OpenGraphImage, width } from 'components/OpenGraphImage'
import { Settings, settingsQuery } from 'lib/sanity.queries'

import { getProdUrl } from '../../components/utils/getProdUrl'

export default async function og(req: NextRequest, res: NextResponse) {
  const font = fetch(`${getProdUrl()}/Inter-Bold.woff`).then((res) =>
    res.arrayBuffer(),
  )
  const { searchParams } = new URL(req.url)

  let title = searchParams.get('title')
  if (!title) {
    const client = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
    })
    const settings = (await client.fetch<Settings>(settingsQuery)) || {}
    title = settings?.ogImage?.title
  }

  return new ImageResponse(<OpenGraphImage title={title} />, {
    width,
    height,
    fonts: [
      {
        name: 'Inter',
        data: await font,
        style: 'normal',
        weight: 700,
      },
    ],
  })
}
