import {
	getSanityRevalidationTargets,
	revalidateTargets,
	type RevalidationTarget,
} from '@/lib/revalidation'
import { parseBody } from 'next-sanity/webhook'
import type { NextRequest } from 'next/server'
import dns from 'node:dns/promises'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type PeerResult = {
	address: string
	ok: boolean
	status?: number
	error?: string
}

export async function POST(request: NextRequest) {
	const secret = process.env.SANITY_REVALIDATE_SECRET

	if (!secret) {
		return Response.json(
			{ error: 'SANITY_REVALIDATE_SECRET is not configured' },
			{ status: 500 },
		)
	}

	const { body, isValidSignature } = await parseBody(request, secret)

	if (!isValidSignature) {
		return Response.json({ error: 'Invalid Sanity signature' }, { status: 401 })
	}

	const targets = getSanityRevalidationTargets(body)
	revalidateTargets(targets)

	const peers = await revalidatePeers(targets, secret)
	const failedPeers = peers.filter((peer) => !peer.ok)

	return Response.json(
		{
			revalidated: failedPeers.length === 0,
			targets,
			peers,
		},
		{ status: failedPeers.length ? 502 : 200 },
	)
}

async function revalidatePeers(
	targets: RevalidationTarget[],
	secret: string,
): Promise<PeerResult[]> {
	const peerDnsName = process.env.REVALIDATE_PEER_DNS_NAME
	if (!peerDnsName) return []

	let addresses: string[]
	try {
		addresses = await dns.resolve4(peerDnsName)
	} catch (error) {
		return [
			{
				address: peerDnsName,
				ok: false,
				error: error instanceof Error ? error.message : 'DNS lookup failed',
			},
		]
	}

	return await Promise.all(
		[...new Set(addresses)].map(async (address) => {
			try {
				const response = await fetch(
					`http://${address}:3000/api/revalidate/peer`,
					{
						method: 'POST',
						headers: {
							Authorization: `Bearer ${secret}`,
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ targets }),
						cache: 'no-store',
					},
				)

				return {
					address,
					ok: response.ok,
					status: response.status,
				}
			} catch (error) {
				return {
					address,
					ok: false,
					error: error instanceof Error ? error.message : 'Request failed',
				}
			}
		}),
	)
}
