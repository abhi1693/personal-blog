const assert = require('node:assert/strict')
const fs = require('node:fs')
const process = require('node:process')
const console = require('node:console')
const { URL } = require('node:url')
const { setTimeout, clearTimeout } = require('node:timers')
const { fetch, AbortSignal } = globalThis
const { spawn } = require('node:child_process')
const { randomUUID } = require('node:crypto')
const sharp = require('sharp')

async function main() {
	assert.equal(process.getuid(), 1001)
	assert.equal(process.getgid(), 1001)
	assert.equal(
		process.arch,
		process.env.EXPECTED_PLATFORM === 'linux/arm64' ? 'arm64' : 'x64',
	)
	assert.equal(process.versions.node, process.env.EXPECTED_NODE_VERSION)
	assert.equal(
		require('/app/package.json').version,
		process.env.EXPECTED_APP_VERSION,
	)
	assert.equal(process.env.APP_VERSION, process.env.EXPECTED_APP_VERSION)
	assert.equal(
		require('next/package.json').version,
		process.env.EXPECTED_NEXT_VERSION,
	)
	for (const path of [
		'/usr/local/lib/node_modules/npm',
		'/usr/local/lib/node_modules/corepack',
		'/usr/local/bin/npm',
		'/usr/local/bin/npx',
		'/usr/local/bin/yarn',
		'/usr/local/bin/yarnpkg',
		'/usr/local/bin/corepack',
	])
		assert.equal(fs.existsSync(path), false, `Unexpected runtime tool: ${path}`)
	const fixture = await sharp({
		create: {
			width: 16,
			height: 16,
			channels: 4,
			background: { r: 30, g: 60, b: 90, alpha: 1 },
		},
	})
		.png()
		.toBuffer()
	const transformed = await sharp(fixture).resize(8, 8).webp().toBuffer()
	const metadata = await sharp(transformed).metadata()
	assert.equal(metadata.format, 'webp')
	assert.equal(metadata.width, 8)
	const server = spawn(process.execPath, ['server.js'], {
		cwd: '/app',
		env: {
			...process.env,
			HOSTNAME: '127.0.0.1',
			PORT: '3000',
			// Only the isolated smoke receives a synthetic import-time token.
			// No CMS route is requested and --network none prevents external traffic.
			SANITY_API_READ_TOKEN: randomUUID(),
		},
		stdio: ['ignore', 'inherit', 'inherit'],
	})
	const get = (path, options = {}) =>
		fetch(new URL(path, 'http://127.0.0.1:3000'), {
			...options,
			signal: AbortSignal.timeout(5000),
		})
	try {
		let ready
		for (let attempt = 0; attempt < 60; attempt++) {
			assert.equal(server.exitCode, null, 'Next.js exited during startup')
			try {
				ready = await get('/admin')
				if (ready.ok) break
			} catch {
				/* Startup. */
			}
			await new Promise((resolve) => setTimeout(resolve, 250))
		}
		assert.equal(ready?.status, 200, 'Runtime API did not become ready')
		const studio = await get('/admin')
		assert.equal(studio.status, 200, 'Built Studio HTML did not load')
		const html = await studio.text()
		assert.match(html, /<html|<!DOCTYPE/i)
		const assets = [
			...html.matchAll(
				/(?:src|href)="(\/_next\/static\/[^"?#]+\.(?:js|css)(?:\?[^"#]*)?)"/g,
			),
		].map((match) => match[1].replaceAll('&amp;', '&'))
		for (const extension of ['js', 'css']) {
			const asset = assets.find((path) =>
				path.split('?')[0].endsWith(`.${extension}`),
			)
			assert.ok(asset, `Studio did not reference a real ${extension} asset`)
			const response = await get(asset)
			assert.equal(response.status, 200)
			assert.ok((await response.arrayBuffer()).byteLength > 0)
		}
		assert.equal((await get('/api/newsletter/send')).status, 401)
		assert.equal((await get('/api/newsletter/unsubscribe')).status, 400)
		const invalid = await get('/api/newsletter/subscribe', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: '{',
		})
		assert.equal(invalid.status, 400)
		console.log(
			JSON.stringify({
				app: process.env.EXPECTED_APP_VERSION,
				node: process.versions.node,
				next: process.env.EXPECTED_NEXT_VERSION,
				checks: [
					'native-sharp',
					'runtime-api-version',
					'studio-html-assets',
					'newsletter-guards',
					'no-package-managers',
				],
			}),
		)
	} finally {
		if (server.exitCode === null && server.signalCode === null) {
			server.kill('SIGTERM')
			await new Promise((resolve) => {
				const timeout = setTimeout(() => server.kill('SIGKILL'), 5000)
				server.once('exit', () => {
					clearTimeout(timeout)
					resolve()
				})
			})
		}
	}
}

main().catch((error) => {
	console.error(error)
	process.exitCode = 1
})
