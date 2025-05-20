import assert from 'assert'
import { isValidEmail, sanitizeText } from '../src/lib/validation'

assert.ok(isValidEmail('user@example.com'))
assert.ok(!isValidEmail('bademail'))

assert.strictEqual(sanitizeText('<b>Hello</b> World'), 'Hello World')
assert.strictEqual(sanitizeText('   spaced   ', 10), 'spaced')
const long = sanitizeText('a'.repeat(100), 20)
assert.strictEqual(long.length, 20)
console.log('validation tests passed')

