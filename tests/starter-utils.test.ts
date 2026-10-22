import { getBlockText, getPreset } from '../src/sanity/starter-utils/preview'
import assert from 'assert'

assert.strictEqual(getBlockText(undefined), '')
assert.strictEqual(getBlockText([]), '')
assert.strictEqual(
	getBlockText([
		{ children: [{ text: 'Hello' }, { text: ' world' }] },
		{},
		{ children: [{ text: 'Again' }] },
	]),
	'Hello world↵ ↵ Again',
)
assert.strictEqual(
	getBlockText(
		[{ children: [{ text: 'One' }] }, { children: [{ text: 'Two' }] }],
		'\n',
	),
	'One\nTwo',
)
assert.strictEqual(getPreset('center'), 'center')
assert.strictEqual(getPreset({ value: 'start' }, 'title'), 'start')
assert.strictEqual(
	getPreset({ value: 'start', title: 'Left' }, 'title'),
	'Left',
)
assert.strictEqual(getPreset({ value: 'start', title: 'Left' }), 'start')
console.log('starter helper preview tests passed')
