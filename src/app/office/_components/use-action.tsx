'use client';

import { useCallback, useState, useTransition } from 'react';
import type { ActionResult } from '../_lib/actions';

/**
 * Runs one dashboard mutation and tracks what the screen has to show while it
 * is in flight.
 *
 * `useTransition` rather than a plain `useState` flag because these actions
 * end in `revalidatePath`: the pending state has to stay true until the server
 * has re-rendered and the new rows have arrived, not just until the POST
 * resolves. Without it every dialog closed onto stale data for a beat.
 */
export function useAction() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(
    (action: () => Promise<ActionResult>, onDone?: () => void) => {
      setError(null);
      startTransition(async () => {
        const result = await action();
        if (result.ok) {
          onDone?.();
        } else {
          setError(result.error);
        }
      });
    },
    []
  );

  return { pending, error, setError, run };
}
