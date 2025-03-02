import { NextSchemaScript } from '@operationnation/sanity-plugin-schema-markup/nextSchemaScript'

import { getBaseUrl } from './utils/getBaseUrl'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const WebsiteSchemaMarkup = ({ settings }) => {
  const websiteSchemaType = {
    type: 'WebSite',
    url: getBaseUrl(),
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
