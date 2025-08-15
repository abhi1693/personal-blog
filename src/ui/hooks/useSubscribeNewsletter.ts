'use client'

import { useCallback, useState } from 'react'
import {
  SUBSCRIBER_STATUS_KEY,
  SUBSCRIBER_STATUS_SUBSCRIBED,
} from '@/lib/env'
import {
  subscribeNewsletter,
  markSubscribedLocal,
  type SubscriptionPayload,
  type SubscriptionResult,
} from '@/lib/newsletter'

export type SubscribeStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'already'
  | 'error'

export function useSubscribeNewsletter(onSuccess?: () => void) {
  const [status, setStatus] = useState<SubscribeStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const submit = useCallback(async (payload: SubscriptionPayload) => {
    setStatus('loading')
    setError(null)
    const res: SubscriptionResult = await subscribeNewsletter(payload)

    if (res.ok) {
      markSubscribedLocal(SUBSCRIBER_STATUS_KEY, SUBSCRIBER_STATUS_SUBSCRIBED)
      setStatus(res.code === 'already' ? 'already' : 'success')
      onSuccess?.()
      return res
    }

    setStatus('error')
    setError(res.message || 'Something went wrong.')
    return res
  }, [onSuccess])

  return { status, error, submit }
}

