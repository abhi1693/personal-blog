import {
	normalizeTargets,
	type RevalidationTarget,
} from './revalidation-targets'
import { revalidatePath } from 'next/cache'
import 'server-only'

export {
	getSanityRevalidationTargets,
	normalizeTargets,
} from './revalidation-targets'
export type { RevalidationTarget }

export function revalidateTargets(targets: RevalidationTarget[]) {
	for (const target of normalizeTargets(targets)) {
		revalidatePath(target.path, target.type)
	}
}
