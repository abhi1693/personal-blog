import { getResendClient } from '../src/lib/resend'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

assert.equal(typeof getResendClient, 'function')

const result = spawnSync(
	process.execPath,
	[
		'-e',
		`
const assert = require('node:assert/strict')
const { getResendClient } = require(${JSON.stringify(require.resolve('../src/lib/resend'))})
assert.throws(() => getResendClient(), /Missing API key/)
process.env.RESEND_API_KEY_FULL = 're_ci_fixture_only_not_a_production_key'
const client = getResendClient()
assert.equal(getResendClient(), client)
`,
	],
	{ env: { NODE_ENV: 'production' }, encoding: 'utf8' },
)
assert.equal(result.status, 0, result.stderr)
