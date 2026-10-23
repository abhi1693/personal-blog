import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'

const source = fs.readFileSync('src/ui/Reputation/getRepoData.ts', 'utf8')
const compiled = ts.transpileModule(source, {
	compilerOptions: {
		module: ts.ModuleKind.CommonJS,
		target: ts.ScriptTarget.ES2022,
	},
}).outputText

for (const [env, expected] of [
	[
		{ BLOG_GITHUB_TOKEN: 'app-fixture', GITHUB_TOKEN: 'legacy-fixture' },
		'app-fixture',
	],
	[{ GITHUB_TOKEN: 'legacy-fixture' }, 'legacy-fixture'],
	[{ BLOG_GITHUB_TOKEN: '', GITHUB_TOKEN: 'legacy-fixture' }, 'legacy-fixture'],
	[{}, undefined],
] as const) {
	let observed: string | undefined
	vm.runInNewContext(
		compiled,
		{
			exports: {},
			process: { env },
			require(name: string) {
				if (name === 'next-sanity')
					return { stegaClean: (value: unknown) => value }
				if (name === 'next/cache')
					return { unstable_cache: (fn: unknown) => fn }
				if (name === 'octokit')
					return {
						Octokit: class {
							constructor({ auth }: { auth?: string }) {
								observed = auth
							}
						},
					}
				throw new Error('Unexpected module in isolated token regression')
			},
		},
		{ timeout: 1000 },
	)
	assert.equal(observed, expected)
}
