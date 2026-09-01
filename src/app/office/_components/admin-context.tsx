'use client';

import { createContext, useContext, type ReactNode } from 'react';

/**
 * The signed-in admin, for chrome that is rendered from inside client
 * components — the topbar sits in Shell, and Shell is rendered by the
 * `'use client'` view of every screen, so it cannot read the session itself.
 * The (dashboard) layout is a server component and fetches it once.
 */
export type Admin = {
  name: string;
  email: string;
  avatarUrl: string | null;
};

const AdminContext = createContext<Admin | null>(null);

export function AdminProvider({
  admin,
  children
}: {
  admin: Admin | null;
  children: ReactNode;
}) {
  return <AdminContext.Provider value={admin}>{children}</AdminContext.Provider>;
}

export function useAdmin(): Admin | null {
  return useContext(AdminContext);
}
