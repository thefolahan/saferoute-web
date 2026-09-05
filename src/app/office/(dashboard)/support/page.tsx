import { officeFetch } from '../../_lib/session';
import { rangeToDates } from '../../_components/ui';
import { SupportView, type Ticket, type TicketDetail } from './support-view';

export const dynamic = 'force-dynamic';

type ApiList = {
  counts: { pending: number; resolved: number };
  rows: {
    id: string;
    reference: string;
    subject: string;
    status: string;
    priority: string;
    reporter: string;
    createdAt: string;
  }[];
};

type ApiDetail = {
  id: string;
  reference: string;
  subject: string;
  body: string;
  status: string;
  createdAt: string;
  reporter: { name: string; email: string | null };
  replies: {
    id: string;
    body: string;
    from: 'admin' | 'user';
    author: string;
    createdAt: string;
  }[];
};

export default async function SupportPage({
  searchParams
}: {
  searchParams: Promise<{ status?: string; id?: string; range?: string }>;
}) {
  const params = await searchParams;
  const status = params.status === 'resolved' ? 'resolved' : 'pending';

  const dates = rangeToDates(params.range);
  const query = new URLSearchParams({ status });
  if (dates.from) query.set('from', dates.from);
  if (dates.to) query.set('to', dates.to);

  const list = await officeFetch<ApiList>(
    `/admin/support/tickets?${query.toString()}`
  );
  const rows = list?.rows ?? [];

  // Open the requested ticket, otherwise the top of the queue.
  const selectedId = params.id ?? rows[0]?.id;
  const detail = selectedId
    ? await officeFetch<ApiDetail>(`/admin/support/tickets/${selectedId}`).catch(
        () => null
      )
    : null;

  return (
    <SupportView
      tabs={[
        { id: 'pending', label: 'Pending', count: String(list?.counts.pending ?? 0) },
        { id: 'resolved', label: 'Resloved', count: String(list?.counts.resolved ?? 0) }
      ]}
      tickets={rows.map((row): Ticket => ({
        id: row.id,
        reference: row.reference,
        subject: row.subject,
        status: row.status,
        priority: row.priority,
        reporter: row.reporter
      }))}
      detail={detail ? toDetail(detail) : null}
    />
  );
}

function toDetail(ticket: ApiDetail): TicketDetail {
  return {
    id: ticket.id,
    reference: ticket.reference,
    subject: ticket.subject,
    body: ticket.body,
    status: ticket.status,
    submitted: new Date(ticket.createdAt).toLocaleString('en', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }),
    reporter: ticket.reporter,
    replies: ticket.replies.map((reply) => ({
      id: reply.id,
      body: reply.body,
      from: reply.from,
      author: reply.from === 'admin' ? `${reply.author} · Admin reply` : reply.author,
      at: new Date(reply.createdAt).toLocaleTimeString('en', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }))
  };
}
