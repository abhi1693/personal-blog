const fs = require('node:fs')
const process = require('node:process')
const { spawnSync } = require('node:child_process')

const optionalPublic = new Set([
	'NEXT_GOOGLE_ADSENSE_ID',
	'NEXT_GOOGLE_ANALYTICS_ID',
	'NEXT_GOOGLE_TAG_MANAGER_ID',
	'NEXT_PUBLIC_SANITY_API_VERSION',
])

const allowed = new Set([
	'NEXT_GOOGLE_ADSENSE_ID',
	'NEXT_GOOGLE_ANALYTICS_ID',
	'NEXT_GOOGLE_TAG_MANAGER_ID',
	'NEXT_PUBLIC_BASE_URL',
	'NEXT_PUBLIC_SANITY_API_VERSION',
	'NEXT_PUBLIC_SANITY_DATASET',
	'NEXT_PUBLIC_SANITY_PROJECT_ID',
	'BLOG_GITHUB_TOKEN',
	'SANITY_API_READ_TOKEN',
])

function parseBuildEnvironment(raw) {
	let values
	try {
		values = JSON.parse(raw)
	} catch {
		throw new Error('Build environment must be valid JSON')
	}
	if (!values || typeof values !== 'object' || Array.isArray(values)) {
		throw new Error('Build environment must be a JSON object')
	}
	for (const [name, value] of Object.entries(values)) {
		if (!allowed.has(name))
			throw new Error(`Unexpected build variable: ${name}`)
		// GitHub toJSON represents unset vars as null. Preserve the app's
		// existing optional defaults without accepting null CMS credentials.
		if (value === null && optionalPublic.has(name)) {
			delete values[name]
			continue
		}
		if (typeof value !== 'string' || /[\r\n\0]/.test(value)) {
			throw new Error(`Invalid build variable: ${name}`)
		}
	}
	for (const name of [
		'NEXT_PUBLIC_BASE_URL',
		'NEXT_PUBLIC_SANITY_DATASET',
		'NEXT_PUBLIC_SANITY_PROJECT_ID',
		'SANITY_API_READ_TOKEN',
	]) {
		if (!values[name])
			throw new Error(`Missing required build variable: ${name}`)
	}
	return values
}

if (require.main === module) {
	const values = parseBuildEnvironment(fs.readFileSync(process.argv[2], 'utf8'))
	const env = {
		...process.env,
		...values,
		NEXT_PUBLIC_FARO_APP_VERSION: require('../package.json').version,
	}
	for (const name of [
		'CRON_SECRET',
		'RESEND_API_KEY_FULL',
		'NEXT_RESEND_AUDIENCE_ID',
	]) {
		delete env[name]
	}
	const result = spawnSync(
		process.execPath,
		['/usr/local/lib/node_modules/npm/bin/npm-cli.js', 'run', 'build'],
		{ env, stdio: 'inherit' },
	)
	process.exit(result.status ?? 1)
}

module.exports = { parseBuildEnvironment }
