// Execute the version job's guard suite in a dependency-free checkout fixture.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const process = require('node:process')
const { execFileSync, spawnSync } = require('node:child_process')

const source = path.dirname(require.resolve('../package.json'))
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'blog-image-preflight-'))
const env = { ...process.env, NODE_PATH: '', NODE_OPTIONS: '' }

try {
	for (let ancestor = scratch; ; ancestor = path.dirname(ancestor)) {
		assert.equal(
			fs.existsSync(path.join(ancestor, 'node_modules')),
			false,
			'Preflight fixture must not have ancestor dependencies',
		)
		if (ancestor === path.dirname(ancestor)) break
	}
	const files = [
		'package.json',
		'scripts/build-environment.test.cjs',
		'scripts/build-with-env.cjs',
		'scripts/image-version.cjs',
		'.github/workflows/ci.yml',
		'.github/workflows/runtime-image.yml',
	]
	for (const file of files) {
		const destination = path.join(scratch, file)
		fs.mkdirSync(path.dirname(destination), { recursive: true })
		fs.copyFileSync(path.join(source, file), destination)
	}
	const git = (...args) =>
		execFileSync('git', args, { cwd: scratch, env, stdio: 'pipe' })
	git('init', '--quiet', '--initial-branch=master')
	git('add', '--', ...files)
	git(
		'-c',
		'core.hooksPath=/dev/null',
		'-c',
		'commit.gpgsign=false',
		'-c',
		'user.name=Preflight Fixture',
		'-c',
		'user.email=preflight@example.test',
		'commit',
		'--quiet',
		'-m',
		'Create isolated preflight fixture',
	)
	const dependencyCheck = spawnSync(
		process.execPath,
		[
			'-e',
			`
try { require.resolve('typescript'); process.exit(1) }
catch (error) { if (error.code !== 'MODULE_NOT_FOUND') throw error }
`,
		],
		{ cwd: scratch, env, encoding: 'utf8' },
	)
	assert.equal(
		dependencyCheck.status,
		0,
		'Fixture unexpectedly resolves dev dependencies',
	)
	const result = spawnSync(
		process.execPath,
		['--test', 'scripts/build-environment.test.cjs'],
		{ cwd: scratch, env, stdio: 'inherit', timeout: 30000 },
	)
	assert.equal(result.error, undefined, 'Standalone preflight did not complete')
	process.exitCode = result.status ?? 1
} finally {
	fs.rmSync(scratch, { recursive: true, force: true })
}
