'use client'

import { getPreset } from './preview'
import {
	Badge,
	Box,
	Card,
	Flex,
	Heading,
	Stack,
	Text,
	TextInput,
} from '@sanity/ui'
import { Code } from '@sanity/ui/code'
import { useCallback, useState, type ComponentType } from 'react'
import {
	MdFormatAlignCenter,
	MdFormatAlignJustify,
	MdFormatAlignLeft,
	MdFormatAlignRight,
	MdVerticalAlignBottom,
	MdVerticalAlignCenter,
	MdVerticalAlignTop,
	MdVerticalDistribute,
} from 'react-icons/md'
import { defineField, set, unset, type StringInputProps } from 'sanity'
import type {
	Divider,
	ListItem,
	ListItemBuilder,
	StructureBuilder,
} from 'sanity/structure'

export { getBlockText, getPreset } from './preview'

// These small, app-owned helpers replace a starter dependency that requires
// React 18/Sanity 3 and cannot share the current React 19/Sanity 6 peer tree.
export type Preset =
	| string
	| {
			title?: string
			value: string
			icon?: ComponentType
	  }

export function TextInputWithPresets({
	elementProps,
	onChange,
	readOnly,
	prefix,
	suffix,
	presets,
}: StringInputProps & {
	prefix?: string
	suffix?: string
	presets?: Preset[]
}) {
	const [prefixWidth, setPrefixWidth] = useState(0)
	const measurePrefix = useCallback((element: HTMLDivElement | null) => {
		if (element) setPrefixWidth(element.offsetWidth + 4)
	}, [])
	const change = (value: string) => {
		if (!readOnly) onChange(value ? set(value) : unset())
	}
	return (
		<Stack gap={2}>
			<Flex align="center" gap={1}>
				{prefix && (
					<Box ref={measurePrefix}>
						<Text size={1} muted>
							{prefix}
						</Text>
					</Box>
				)}
				<Card flex={1}>
					<TextInput
						{...elementProps}
						readOnly={readOnly}
						onChange={(event) => change(event.currentTarget.value)}
					/>
				</Card>
				{suffix && (
					<Text size={1} muted>
						{suffix}
					</Text>
				)}
			</Flex>
			{presets && (
				<Flex gap={1} style={{ marginLeft: prefixWidth }} wrap="wrap">
					{presets.map((preset) => {
						const value = getPreset(preset)
						const Icon = typeof preset === 'object' ? preset.icon : undefined
						return (
							<Badge
								as="button"
								type="button"
								disabled={readOnly}
								style={{ cursor: readOnly ? 'default' : 'pointer' }}
								padding={2}
								tone={value === elementProps.value ? 'primary' : 'default'}
								onClick={() => change(value)}
								key={value}
							>
								<Flex align="center" gap={1}>
									{Icon && <Icon />}
									{getPreset(preset, 'title')}
								</Flex>
							</Badge>
						)
					})}
				</Flex>
			)}
		</Stack>
	)
}

export const textAlign = defineField({
	name: 'textAlign',
	title: 'Text alignment',
	type: 'string',
	initialValue: 'center',
	components: {
		input: (props) => (
			<TextInputWithPresets
				{...props}
				presets={[
					{ value: 'start', icon: MdFormatAlignLeft },
					{ value: 'center', icon: MdFormatAlignCenter },
					{ value: 'end', icon: MdFormatAlignRight },
					{ value: 'justify', icon: MdFormatAlignJustify },
				]}
			/>
		),
	},
})

export const alignItems = defineField({
	name: 'alignItems',
	title: 'Vertical alignment',
	type: 'string',
	initialValue: 'center',
	components: {
		input: (props) => (
			<TextInputWithPresets
				{...props}
				presets={[
					{ value: 'start', icon: MdVerticalAlignTop },
					{ value: 'center', icon: MdVerticalAlignCenter },
					{ value: 'end', icon: MdVerticalAlignBottom },
					{ value: 'stretch', icon: MdVerticalDistribute },
				]}
			/>
		),
	},
})

export function singleton(S: StructureBuilder, id: string, title?: string) {
	return S.listItem()
		.id(id)
		.title(
			title ||
				id
					.split(/(?=[A-Z])/)
					.map((word) => word[0].toUpperCase() + word.slice(1))
					.join(' '),
		)
		.child(S.document().id(id).schemaType(id).documentId(id))
}

export function group(
	S: StructureBuilder,
	title: string,
	items: (ListItemBuilder | ListItem | Divider)[],
) {
	return S.listItem().title(title).child(S.list().title(title).items(items))
}

export function icon() {
	// A Studio favicon does not need Next's application image optimization route.
	return (
		// eslint-disable-next-line @next/next/no-img-element
		<img
			style={{ width: '100%', aspectRatio: '1' }}
			src="/favicon.ico"
			alt="Blog Studio"
		/>
	)
}

export function infoWidget({ version }: { version?: string } = {}) {
	return {
		name: 'Guide',
		layout: { width: 'medium' as const },
		component: function BlogInfoWidget() {
			return (
				<Card paddingY={4}>
					<Stack gap={4}>
						<Box paddingX={3}>
							<Heading size={1}>
								Blog Studio {version && <Code size={1}>v{version}</Code>}
							</Heading>
						</Box>
						<Box paddingX={3}>
							<Text size={1}>
								<a
									href="https://www.sanity.io/docs"
									target="_blank"
									rel="noreferrer"
								>
									Sanity documentation
								</a>
							</Text>
						</Box>
					</Stack>
				</Card>
			)
		},
	}
}
