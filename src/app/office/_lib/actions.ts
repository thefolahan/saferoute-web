'use server';

import { revalidatePath } from 'next/cache';
import { officeSend, type OfficeResult } from './api';

/**
 * Every write the dashboard makes.
 *
 * They live in one server-action module rather than in route handlers because
 * of where the session lives: the admin token is an httpOnly cookie that the
 * page's JavaScript cannot read, so a `fetch` from a client component could
 * not authenticate itself. A server action runs on the server, reads the
 * cookie, and calls the API with it — the token still never reaches the
 * browser, and there is no second API surface to keep in step with the first.
 *
 * All of them return `ActionResult`, never throw: the caller is a button, and
 * a rejected promise in an event handler is a blank screen.
 */
export type ActionResult = { ok: true } | { ok: false; error: string };

/** Every dashboard route is `force-dynamic`, so one sweep re-reads them all. */
function refresh() {
  revalidatePath('/office', 'layout');
}

function toResult(result: OfficeResult): ActionResult {
  if (!result.ok) return { ok: false, error: result.error };
  refresh();
  return { ok: true };
}

/* -------------------------------------------------------------- incidents */

/**
 * Approve or reject a report from the Incidents panel.
 *
 * Approving is two decisions in the schema — the incident is `verified` and
 * the badge on it becomes `moderator_verified` — and the verify endpoint sets
 * both, which is why approval does not go through changeStatus.
 */
export async function decideIncident(
  id: string,
  decision: 'approve' | 'reject',
  reason?: string
): Promise<ActionResult> {
  const because = reason?.trim() || defaultReason(decision);

  if (decision === 'approve') {
    return toResult(
      await officeSend(`/admin/incidents/${id}/verify`, 'PATCH', {
        verificationStatus: 'moderator_verified',
        reason: because
      })
    );
  }

  return toResult(
    await officeSend(`/admin/incidents/${id}/status`, 'PATCH', {
      status: 'rejected',
      reason: because
    })
  );
}

/**
 * Take a verification back (Figma 907:13222 "Revoke action").
 *
 * The report returns to moderation rather than being rejected — revoking says
 * "this should not have been passed", not "this is false", and those are
 * different decisions with different consequences for the reporter.
 */
export async function revokeVerification(
  id: string,
  reason?: string
): Promise<ActionResult> {
  return toResult(
    await officeSend(`/admin/incidents/${id}/status`, 'PATCH', {
      status: 'pending_moderation',
      reason: reason?.trim() || 'Verification revoked from the dashboard.'
    })
  );
}

/** The Needs Action queue's own decisions, which resolve a queue item. */
export async function resolveModerationItem(
  id: string,
  action: 'approve' | 'reject' | 'request_more_evidence' | 'escalate',
  reason?: string
): Promise<ActionResult> {
  return toResult(
    await officeSend(`/admin/moderation-queue/${id}`, 'PATCH', {
      action,
      reason: reason?.trim() || defaultReason(action)
    })
  );
}

/* ----------------------------------------------------------- verification */

export async function decideVerification(
  userId: string,
  decision: 'approved' | 'rejected'
): Promise<ActionResult> {
  return toResult(
    await officeSend(`/admin/verification/${userId}`, 'PATCH', { decision })
  );
}

/* --------------------------------------------------------------- contents */

export async function setContentStatus(
  id: string,
  status: 'published' | 'rejected' | 'removed' | 'pending_review',
  reason?: string
): Promise<ActionResult> {
  return toResult(
    await officeSend(`/admin/contents/${id}/status`, 'PATCH', {
      status,
      ...(reason?.trim() ? { reason: reason.trim() } : {})
    })
  );
}

/* ---------------------------------------------------------------- support */

export async function replyToTicket(
  id: string,
  body: string
): Promise<ActionResult> {
  const message = body.trim();
  if (!message) return { ok: false, error: 'Write a reply first.' };

  return toResult(
    await officeSend(`/admin/support/tickets/${id}/replies`, 'POST', {
      body: message
    })
  );
}

export async function setTicketStatus(
  id: string,
  status: 'resolved' | 'escalated' | 'deferred' | 'in_progress'
): Promise<ActionResult> {
  return toResult(
    await officeSend(`/admin/support/tickets/${id}/status`, 'PATCH', { status })
  );
}

/* -------------------------------------------------------------- broadcast */

export type BroadcastDraft = {
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  city?: string;
  channels: ('push' | 'in_app' | 'sms' | 'email')[];
  /** ISO string, or omitted to send immediately. */
  scheduledFor?: string;
};

export async function createBroadcast(
  draft: BroadcastDraft
): Promise<ActionResult> {
  if (!draft.title.trim()) return { ok: false, error: 'Give the broadcast a title.' };
  if (!draft.message.trim()) return { ok: false, error: 'Write the message.' };
  if (draft.channels.length === 0) {
    return { ok: false, error: 'Pick at least one delivery channel.' };
  }

  return toResult(
    await officeSend('/admin/broadcasts', 'POST', {
      title: draft.title.trim(),
      message: draft.message.trim(),
      severity: draft.severity,
      channels: draft.channels,
      ...(draft.city?.trim() ? { city: draft.city.trim() } : {}),
      ...(draft.scheduledFor ? { scheduledFor: draft.scheduledFor } : {})
    })
  );
}

export async function cancelBroadcast(id: string): Promise<ActionResult> {
  return toResult(await officeSend(`/admin/broadcasts/${id}/cancel`, 'PATCH'));
}

/* --------------------------------------------------------- access control */

export async function inviteMember(input: {
  email: string;
  role: string;
  message?: string;
}): Promise<ActionResult> {
  if (!input.email.trim()) return { ok: false, error: 'Enter an email address.' };
  if (!input.role) return { ok: false, error: 'Choose a role.' };

  return toResult(
    await officeSend('/admin/team/members', 'POST', {
      email: input.email.trim(),
      role: input.role,
      ...(input.message?.trim() ? { message: input.message.trim() } : {})
    })
  );
}

export async function updateMember(
  id: string,
  input: { fullName?: string; role?: string }
): Promise<ActionResult> {
  return toResult(await officeSend(`/admin/team/members/${id}`, 'PATCH', input));
}

export async function removeMember(id: string): Promise<ActionResult> {
  return toResult(await officeSend(`/admin/team/members/${id}`, 'DELETE'));
}

export async function setRolePermission(
  roleId: string,
  key: string,
  enabled: boolean
): Promise<ActionResult> {
  return toResult(
    await officeSend(`/admin/team/roles/${roleId}/permissions`, 'PATCH', {
      key,
      enabled
    })
  );
}

/* ------------------------------------------------------------------ users */

export async function setUserStatus(
  id: string,
  status: 'active' | 'suspended',
  reason?: string
): Promise<ActionResult> {
  return toResult(
    await officeSend(`/admin/users/${id}/status`, 'PATCH', {
      status,
      ...(reason?.trim() ? { reason: reason.trim() } : {})
    })
  );
}

/**
 * Message or formally warn one citizen.
 *
 * Lands as a notification, not a direct message: an admin has no `User` row to
 * send one from, and a moderator writing into a peer thread would read as
 * another citizen rather than SafeRoute.
 */
/**
 * End every session this account has open.
 *
 * The refresh tokens are revoked rather than deleted — a token that was issued
 * and then revoked is part of the record of what happened to the account.
 */
export async function revokeUserSessions(
  id: string,
  reason?: string
): Promise<ActionResult> {
  return toResult(
    await officeSend(`/admin/users/${id}/sessions/revoke`, 'POST', {
      reason: reason?.trim() || 'Revoked from the dashboard'
    })
  );
}

/** Edit an account's record — the fields the Overview tab can change. */
export async function updateUser(
  id: string,
  patch: Record<string, string | number | boolean>
): Promise<ActionResult> {
  return toResult(await officeSend(`/admin/users/${id}`, 'PATCH', patch));
}

/** Suspend or restore several accounts from the Users table's selection. */
export async function bulkUserStatus(
  userIds: string[],
  status: 'active' | 'suspended',
  reason?: string
): Promise<ActionResult> {
  return toResult(
    await officeSend('/admin/bulk/users/status', 'POST', {
      userIds,
      status,
      reason: reason?.trim() || undefined
    })
  );
}

/** One message to every selected account. */
export async function bulkNotify(
  userIds: string[],
  input: { title: string; body: string; kind: 'message' | 'warning' }
): Promise<ActionResult> {
  return toResult(
    await officeSend('/admin/bulk/users/notify', 'POST', {
      userIds,
      title: input.title.trim(),
      body: input.body.trim(),
      kind: input.kind
    })
  );
}

/** End one dashboard session from the Security screen. */
export async function revokeAdminSession(id: string): Promise<ActionResult> {
  return toResult(
    await officeSend(`/admin/security/sessions/${id}/revoke`, 'POST')
  );
}

export async function notifyUser(
  id: string,
  input: { title: string; body: string; kind: 'message' | 'warning' }
): Promise<ActionResult> {
  if (!input.title.trim()) return { ok: false, error: 'Give the message a subject.' };
  if (!input.body.trim()) return { ok: false, error: 'Write the message.' };

  return toResult(
    await officeSend(`/admin/users/${id}/notify`, 'POST', {
      title: input.title.trim(),
      body: input.body.trim(),
      kind: input.kind
    })
  );
}

/* ---------------------------------------------------------- configuration */

export async function updateProfile(input: {
  fullName?: string;
  phone?: string;
  department?: string;
  /** Merged over what is stored, so one panel never clears another's. */
  preferences?: Record<string, unknown>;
}): Promise<ActionResult> {
  return toResult(await officeSend('/admin/auth/me', 'PATCH', input));
}

export async function changePassword(input: {
  currentPassword: string;
  newPassword: string;
}): Promise<ActionResult> {
  if (input.newPassword.length < 14) {
    return { ok: false, error: 'The new password must be at least 14 characters.' };
  }

  return toResult(await officeSend('/admin/auth/password', 'POST', input));
}

function defaultReason(action: string): string {
  const verb = action.replace(/_/g, ' ');
  return `Marked ${verb} from the dashboard.`;
}
