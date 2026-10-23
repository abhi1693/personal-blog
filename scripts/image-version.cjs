const fs = require('node:fs')
const process = require('node:process')
const { execFileSync } = require('node:child_process')

function imageVersion({
	sourceVersion,
	requested = '',
	publish = false,
	event,
	refType,
	refName,
	ref,
	sha,
	checkoutSha,
	tagSha,
	actor,
	releaseEvent,
}) {
	if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(sourceVersion))
		throw new Error('Expected a stable source version')
	if (requested && requested.replace(/^v/, '') !== sourceVersion) {
		throw new Error('Requested release does not match package.json')
	}
	if (!/^[a-f0-9]{40}$/.test(sha) || checkoutSha !== sha)
		throw new Error('Checked-out source does not match the workflow commit')
	if (publish) {
		if (
			!requested ||
			!['release', 'workflow_dispatch'].includes(event) ||
			actor === 'dependabot[bot]'
		) {
			throw new Error(
				'Publication requires a release or explicit manual version',
			)
		}
		const expectedTag = sourceVersion
		if (
			refType !== 'tag' ||
			refName !== expectedTag ||
			ref !== `refs/tags/${expectedTag}`
		) {
			throw new Error('Publication requires the exact source version tag')
		}
		if (tagSha !== sha)
			throw new Error(
				'Version tag does not resolve to the workflow source commit',
			)
		if (
			event === 'release' &&
			(releaseEvent?.action !== 'published' ||
				releaseEvent.release?.tag_name !== expectedTag ||
				releaseEvent.release?.draft !== false ||
				releaseEvent.release?.prerelease !== false)
		)
			throw new Error(
				'Publication requires the matching published stable release',
			)
	}
	return sourceVersion
}

if (require.main === module) {
	const env = process.env
	const publish = env.PUBLISH_IMAGE === 'true'
	let tagSha = ''
	if (
		publish &&
		env.GITHUB_REF_TYPE === 'tag' &&
		/^refs\/tags\/\d+\.\d+\.\d+$/.test(env.GITHUB_REF)
	)
		tagSha = execFileSync(
			'git',
			['rev-parse', '--verify', `${env.GITHUB_REF}^{commit}`],
			{ encoding: 'utf8' },
		).trim()
	const version = imageVersion({
		sourceVersion: require('../package.json').version,
		requested: env.REQUESTED_VERSION || '',
		publish,
		event: env.GITHUB_EVENT_NAME,
		refType: env.GITHUB_REF_TYPE,
		refName: env.GITHUB_REF_NAME,
		ref: env.GITHUB_REF,
		sha: env.GITHUB_SHA,
		checkoutSha: execFileSync('git', ['rev-parse', 'HEAD'], {
			encoding: 'utf8',
		}).trim(),
		tagSha,
		actor: env.GITHUB_ACTOR,
		releaseEvent:
			env.GITHUB_EVENT_NAME === 'release'
				? JSON.parse(fs.readFileSync(env.GITHUB_EVENT_PATH, 'utf8'))
				: undefined,
	})
	fs.appendFileSync(
		env.GITHUB_OUTPUT,
		`version=${version}\nsource-sha=${env.GITHUB_SHA}\n`,
	)
}

module.exports = { imageVersion }
