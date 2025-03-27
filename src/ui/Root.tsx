'use client'

import type { ComponentProps } from 'react'

export default function Root(props: ComponentProps<'html'>) {
	return <html lang={"en"} {...props} />
}
