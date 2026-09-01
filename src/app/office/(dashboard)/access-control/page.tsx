import { officeFetch } from '../../_lib/session';
import {
  AccessControlView,
  type MemberRow,
  type RoleCard,
  type RoleOption
} from './access-view';

export const dynamic = 'force-dynamic';

type ApiTeam = {
  members: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
    roleId: string;
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
    permissions: { key: string; description: string | null; enabled: boolean }[];
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
      roleOptions={roles.map((role): RoleOption => ({
        value: role.name,
        label: humanise(role.name)
      }))}
      rows={members.map((member): MemberRow => ({
        id: member.id,
        name: member.name,
        avatarUrl: member.avatarUrl,
        email: member.email,
        roleKey: member.role,
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
        id: role.id,
        title: humanise(role.name),
        subtitle:
          role.description ?? `${role.memberCount} member${role.memberCount === 1 ? '' : 's'}`,
        permissions: role.permissions.map((permission) => ({
          key: permission.key,
          // `incidents.verify` reads as "Incidents Verify"; the description is
          // the sentence underneath it.
          title: humanise(permission.key),
          hint: permission.description ?? permission.key,
          enabled: permission.enabled
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
