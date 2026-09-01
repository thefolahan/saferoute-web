import { officeFetch } from '../../_lib/session';
import {
  AccessControlView,
  type MemberRow,
  type RoleCard
} from './access-view';

export const dynamic = 'force-dynamic';

type ApiTeam = {
  members: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    mfaEnabled: boolean;
    lastLoginAt: string | null;
  }[];
  roles: {
    id: string;
    name: string;
    description: string | null;
    memberCount: number;
    permissions: { key: string; description: string | null }[];
  }[];
};

export default async function AccessControlPage() {
  const team = await officeFetch<ApiTeam>('/admin/team');
  const members = team?.members ?? [];
  const roles = team?.roles ?? [];

  return (
    <AccessControlView
      pageLabel={
        members.length
          ? `Showing 1–${members.length} of ${members.length}`
          : 'No team members yet'
      }
      tabs={[
        { id: 'members', label: 'Team members', count: String(members.length) },
        { id: 'roles', label: 'Roles & permissions' }
      ]}
      rows={members.map((member): MemberRow => ({
        id: member.id,
        name: member.name,
        email: member.email,
        role: humanise(member.role),
        status: member.status,
        login: member.lastLoginAt
          ? new Date(member.lastLoginAt).toLocaleString('en-CA', {
              dateStyle: 'short',
              timeStyle: 'short'
            })
          : 'Never'
      }))}
      roleCards={roles.map((role): RoleCard => ({
        title: humanise(role.name),
        subtitle:
          role.description ?? `${role.memberCount} member${role.memberCount === 1 ? '' : 's'}`,
        permissions: role.permissions.map((permission) => ({
          title: humanise(permission.key.split('.')[0] ?? permission.key),
          hint: permission.description ?? permission.key
        }))
      }))}
    />
  );
}

function humanise(value: string): string {
  return value
    .replace(/[._]/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
}
