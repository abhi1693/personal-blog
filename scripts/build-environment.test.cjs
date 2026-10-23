const assert = require('node:assert/strict')
const process = require('node:process')
const { test } = require('node:test')
const { parseBuildEnvironment } = require('./build-with-env.cjs')
const { imageVersion } = require('./image-version.cjs')

const fixture = {
	NEXT_PUBLIC_BASE_URL: 'https://example.test',
	NEXT_PUBLIC_SANITY_DATASET: 'fixture',
	NEXT_PUBLIC_SANITY_PROJECT_ID: 'fixture',
	SANITY_API_READ_TOKEN: 'ci-fixture-not-a-production-token',
}

test('build configuration preserves literal characters without shell evaluation', () => {
	const values = { ...fixture, GITHUB_TOKEN: 'literal-$()-`quotes`-"-value' }
	assert.deepEqual(parseBuildEnvironment(JSON.stringify(values)), values)
})

test('runtime-only credentials and malformed build files fail closed without values in errors', () => {
	for (const name of [
		'CRON_SECRET',
		'RESEND_API_KEY_FULL',
		'NEXT_RESEND_AUDIENCE_ID',
	]) {
		assert.throws(
			() =>
				parseBuildEnvironment(
					JSON.stringify({ ...fixture, [name]: 'fixture' }),
				),
			/Unexpected build variable/,
		)
	}
	assert.throws(
		() => parseBuildEnvironment('{"secret":"never-echo-this'),
		(error) => {
			assert.equal(error.message, 'Build environment must be valid JSON')
			return true
		},
	)
	assert.throws(
		() =>
			parseBuildEnvironment(
				JSON.stringify({ ...fixture, SANITY_API_READ_TOKEN: '' }),
			),
		/Missing required/,
	)
	assert.throws(
		() =>
			parseBuildEnvironment(
				JSON.stringify({ ...fixture, GITHUB_TOKEN: 'line\nbreak' }),
			),
		/Invalid build variable/,
	)
})

const sha = 'a'.repeat(40)
const release = {
	sourceVersion: '0.3.18',
	requested: '0.3.18',
	publish: true,
	event: 'release',
	refType: 'tag',
	refName: '0.3.18',
	ref: 'refs/tags/0.3.18',
	sha,
	checkoutSha: sha,
	tagSha: sha,
	actor: 'fixture-owner',
	releaseEvent: {
		action: 'published',
		release: { tag_name: '0.3.18', draft: false, prerelease: false },
	},
}

test('published stable release and manual exact-tag replay bind all source identities', () => {
	assert.equal(imageVersion(release), '0.3.18')
	assert.equal(
		imageVersion({ ...release, event: 'workflow_dispatch' }),
		'0.3.18',
	)
	assert.equal(imageVersion({ ...release, requested: 'v0.3.18' }), '0.3.18')
})

test('PRs verify checked-out source without publishing', () => {
	assert.equal(
		imageVersion({
			...release,
			publish: false,
			requested: '',
			event: 'pull_request',
			refType: 'branch',
			refName: '86/merge',
			ref: 'refs/pull/86/merge',
			tagSha: undefined,
		}),
		'0.3.18',
	)
})

test('moving default and feature branches cannot publish even with matching versions', () => {
	for (const refName of ['master', 'main', 'feature'])
		assert.throws(
			() =>
				imageVersion({
					...release,
					event: 'workflow_dispatch',
					refType: 'branch',
					refName,
					ref: `refs/heads/${refName}`,
				}),
			/exact source version tag/,
		)
})

test('tag type, full ref and exact canonical version tag must agree', () => {
	for (const context of [
		{ refName: '0.3.19', ref: 'refs/tags/0.3.19' },
		{ refName: 'v0.3.18', ref: 'refs/tags/v0.3.18' },
		{ ref: 'refs/heads/0.3.18' },
		{ refType: 'branch' },
	])
		assert.throws(
			() => imageVersion({ ...release, ...context }),
			/exact source version tag/,
		)
})

test('workflow commit, checkout and peeled tag target cannot drift', () => {
	assert.throws(
		() => imageVersion({ ...release, checkoutSha: 'b'.repeat(40) }),
		/Checked-out source/,
	)
	assert.throws(
		() => imageVersion({ ...release, sha: 'not-a-commit' }),
		/Checked-out source/,
	)
	assert.throws(
		() => imageVersion({ ...release, tagSha: 'b'.repeat(40) }),
		/Version tag does not resolve/,
	)
	assert.throws(
		() => imageVersion({ ...release, tagSha: '' }),
		/Version tag does not resolve/,
	)
	assert.throws(
		() =>
			imageVersion({ ...release, publish: false, checkoutSha: 'b'.repeat(40) }),
		/Checked-out source/,
	)
})

test('only matching published stable release metadata can promote latest', () => {
	for (const releaseEvent of [
		{ ...release.releaseEvent, action: 'created' },
		{
			action: 'published',
			release: { ...release.releaseEvent.release, tag_name: 'v0.3.17' },
		},
		{
			action: 'published',
			release: { ...release.releaseEvent.release, draft: true },
		},
		{
			action: 'published',
			release: { ...release.releaseEvent.release, prerelease: true },
		},
		undefined,
	])
		assert.throws(
			() => imageVersion({ ...release, releaseEvent }),
			/matching published stable release/,
		)
})

test('untrusted events, missing versions and mismatched source versions fail closed', () => {
	for (const context of [
		{ event: 'pull_request' },
		{ event: 'push' },
		{ requested: '' },
		{ actor: 'dependabot[bot]' },
	])
		assert.throws(
			() => imageVersion({ ...release, ...context }),
			/Publication requires/,
		)
	assert.throws(
		() => imageVersion({ ...release, requested: '0.3.19' }),
		/does not match/,
	)
	assert.throws(
		() => imageVersion({ ...release, sourceVersion: '0.3.18-rc.1' }),
		/stable source version/,
	)
	assert.throws(
		() => imageVersion({ ...release, sourceVersion: '00.3.18' }),
		/stable source version/,
	)
})

test('actual CLI rejects default-branch publication before writing outputs', () => {
	const fs = require('node:fs')
	const os = require('node:os')
	const path = require('node:path')
	const { execFileSync, spawnSync } = require('node:child_process')
	const directory = fs.mkdtempSync(
		path.join(os.tmpdir(), 'blog-release-guard-'),
	)
	try {
		const output = path.join(directory, 'output')
		fs.writeFileSync(output, '')
		const actualSha = execFileSync('git', ['rev-parse', 'HEAD'], {
			encoding: 'utf8',
		}).trim()
		const result = spawnSync(process.execPath, ['scripts/image-version.cjs'], {
			env: {
				...process.env,
				PUBLISH_IMAGE: 'true',
				REQUESTED_VERSION: require('../package.json').version,
				GITHUB_EVENT_NAME: 'workflow_dispatch',
				GITHUB_REF_TYPE: 'branch',
				GITHUB_REF_NAME: 'master',
				GITHUB_REF: 'refs/heads/master',
				GITHUB_SHA: actualSha,
				GITHUB_OUTPUT: output,
			},
			encoding: 'utf8',
		})
		assert.notEqual(result.status, 0)
		assert.match(result.stderr, /exact source version tag/)
		assert.equal(fs.readFileSync(output, 'utf8'), '')
	} finally {
		fs.rmSync(directory, { recursive: true, force: true })
	}
})

test('actual workflow secret wrapper forwards only the minimal opaque JSON without evaluation', () => {
	const fs = require('node:fs')
	const workflow = fs.readFileSync(
		'.github/workflows/runtime-image.yml',
		'utf8',
	)
	const match = workflow.match(/\{"app":\$\{\{\s*toJSON\(format\('([^']+)'/)
	assert.ok(match)
	const names = [
		...workflow.matchAll(/toJSON\(((?:vars|github|secrets)\.[^)]+)\)/g),
	].map((item) => item[1])
	assert.deepEqual(names, [
		'vars.NEXT_GOOGLE_ADSENSE_ID',
		'vars.NEXT_GOOGLE_ANALYTICS_ID',
		'vars.NEXT_GOOGLE_TAG_MANAGER_ID',
		'vars.NEXT_PUBLIC_BASE_URL',
		'vars.NEXT_PUBLIC_SANITY_API_VERSION',
		'vars.NEXT_PUBLIC_SANITY_DATASET',
		'vars.NEXT_PUBLIC_SANITY_PROJECT_ID',
		'github.token',
		'secrets.sanity-read-token',
	])
	const values = {
		...fixture,
		NEXT_GOOGLE_ADSENSE_ID: '',
		NEXT_GOOGLE_ANALYTICS_ID: '',
		NEXT_GOOGLE_TAG_MANAGER_ID: '',
		NEXT_PUBLIC_SANITY_API_VERSION: '2026-10-23',
		GITHUB_TOKEN: 'literal-$()-`quotes`-"-unicode-λ',
	}
	const argumentsJSON = names.map((name) =>
		JSON.stringify(
			values[
				name.startsWith('vars.')
					? name.slice(5)
					: name === 'github.token'
						? 'GITHUB_TOKEN'
						: 'SANITY_API_READ_TOKEN'
			],
		),
	)
	// GitHub format substitutes indexed arguments once and escapes literal braces.
	const opaque = match[1].replace(/\{\{|\}\}|\{(\d+)\}/g, (token, index) =>
		index === undefined ? token[0] : argumentsJSON[Number(index)],
	)
	const wrapper = JSON.parse(`{"app":${JSON.stringify(opaque)}}`)
	assert.equal(typeof wrapper.app, 'string')
	assert.deepEqual(parseBuildEnvironment(wrapper.app), values)
})
