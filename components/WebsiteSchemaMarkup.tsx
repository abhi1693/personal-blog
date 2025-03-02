import { NextSchemaScript } from '@operationnation/sanity-plugin-schema-markup/nextSchemaScript'

import { getProdUrl } from './utils/getProdUrl'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const WebsiteSchemaMarkup = ({ settings }) => {
  const websiteSchemaType = {
    type: 'WebSite',
    url: getProdUrl(),
    name: settings.title,
  }

  return (
    <NextSchemaScript
      schema={[websiteSchemaType]}
      projectId={projectId as string}
      dataset={dataset as string}
    />
  )
}

export default WebsiteSchemaMarkup
