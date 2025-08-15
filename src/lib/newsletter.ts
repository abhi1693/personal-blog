export type SubscriptionPayload = {
  email: string
  firstName?: string
  lastName?: string
}

export type SubscriptionResult = {
  ok: boolean
  code: 'subscribed' | 'already' | 'error'
  message?: string
}

export async function subscribeNewsletter(
  payload: SubscriptionPayload,
): Promise<SubscriptionResult> {
  try {
    const res = await fetch('/api/newsletter/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = (await res.json().catch(() => ({}))) as
      | { message?: string; error?: string }
      | undefined

    if (!res.ok) {
      return {
        ok: false,
        code: 'error',
        message: data?.error || data?.message || 'Subscription failed.',
      }
    }

    const msg = (data?.message || '').toLowerCase()
    if (msg.includes('already')) {
      return { ok: true, code: 'already', message: 'Already subscribed.' }
    }
    return { ok: true, code: 'subscribed', message: 'Subscribed successfully.' }
  } catch (e) {
    return { ok: false, code: 'error', message: 'Network error. Try again.' }
  }
}

export function markSubscribedLocal(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {}
}

export function isSubscribedLocal(key: string, value: string) {
  try {
    return localStorage.getItem(key) === value
  } catch {
    return false
  }
}

