import { GET } from '../src/app/api/faro-config/route'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'

const version = JSON.parse(fs.readFileSync('package.json', 'utf8')).version
assert.equal(typeof GET, 'function')
const route = require.resolve('../src/app/api/faro-config/route')
const result = spawnSync(
	process.execPath,
	[
		'-e',
		`
const assert = require('node:assert/strict')
const { GET } = require(${JSON.stringify(route)})
const version = process.env.IMAGE_VERSION
async function main() {
  const cases = [
    [{ FARO_APP_VERSION: version }, version],
    [{ FARO_APP_VERSION: 'operator-override', NEXT_PUBLIC_FARO_APP_VERSION: version }, 'operator-override'],
    [{ NEXT_PUBLIC_FARO_APP_VERSION: version }, version],
    [{ FARO_APP_VERSION: '', NEXT_PUBLIC_FARO_APP_VERSION: version }, ''],
    [{}, ''],
  ]
  for (const [env, expected] of cases) {
    delete process.env.FARO_APP_VERSION
    delete process.env.NEXT_PUBLIC_FARO_APP_VERSION
    Object.assign(process.env, env)
    const response = GET()
    assert.equal(response.status, 200)
    assert.match(response.headers.get('cache-control'), /no-store/)
    assert.equal((await response.json()).appVersion, expected)
  }
}
main().catch(error => { console.error(error); process.exitCode = 1 })
`,
	],
	{
		env: { NODE_ENV: 'production', IMAGE_VERSION: version },
		encoding: 'utf8',
		timeout: 5000,
	},
)
assert.equal(result.error, undefined)
assert.equal(result.status, 0, result.stderr)
