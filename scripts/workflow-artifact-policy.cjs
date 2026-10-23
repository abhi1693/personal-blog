// Credentials use the minimal shared BuildKit input, never local artifact steps.
const fs = require('node:fs')
const path = require('node:path')

function executableWorkflowFiles(root) {
	const files = []
	function visit(relative) {
		const directory = path.join(root, relative)
		if (!fs.existsSync(directory)) return
		if (fs.lstatSync(directory).isSymbolicLink())
			throw new Error('Executable workflow manifests must be regular files')
		for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
			const name = path.join(relative, entry.name)
			if (entry.isSymbolicLink())
				throw new Error('Executable workflow manifests must be regular files')
			if (entry.isDirectory()) visit(name)
			else if (/\.ya?ml$/i.test(entry.name)) {
				if (!entry.isFile())
					throw new Error('Executable workflow manifests must be regular files')
				files.push(name)
			}
		}
	}
	visit('.github/workflows')
	visit('.github/actions')
	return files.sort()
}

function checkWorkflowSource(source, name) {
	// Conservatively reject direct references anywhere in executable manifests,
	// including quoted, folded and flow mappings, independent of job/artifact names.
	// Shared remote workflows retain their approved reports; docs are not scanned.
	if (/\bactions\/(?:upload|download)-artifact(?:[^a-z0-9_-]|$)/i.test(source))
		throw new Error(`Direct artifact actions are forbidden in ${name}`)
	if (
		/personal-blog-build-secret|prepare-build-secret|build-secret\.env|build-secret-artifact|build-secret-file|(?:write-env|ci-prepare)\.sh/i.test(
			source,
		)
	)
		throw new Error(`Retired secret artifact transport is forbidden in ${name}`)
}

function checkWorkflowArtifactPolicy(root) {
	const files = executableWorkflowFiles(root)
	if (!files.length) throw new Error('No executable workflow manifests found')
	for (const name of files)
		checkWorkflowSource(fs.readFileSync(path.join(root, name), 'utf8'), name)
	return files
}

module.exports = {
	checkWorkflowArtifactPolicy,
	checkWorkflowSource,
	executableWorkflowFiles,
}
