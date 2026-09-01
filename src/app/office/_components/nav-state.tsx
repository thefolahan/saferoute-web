'use client';

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode
} from 'react';

/**
 * Whether the sidebar drawer is open. Only meaningful below `lg`, where the
 * sidebar is off-canvas; at desktop widths it is always visible and this is
 * ignored. Lives in context because the toggle is in the topbar and the drawer
 * is its sibling.
 */
type NavState = { open: boolean; toggle: () => void; close: () => void };

const NavContext = createContext<NavState>({
  open: false,
  toggle: () => {},
  close: () => {}
});

export function NavProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((value) => !value), []);
  const close = useCallback(() => setOpen(false), []);
  return (
    <NavContext.Provider value={{ open, toggle, close }}>
      {children}
    </NavContext.Provider>
  );
}

export function useNav(): NavState {
  return useContext(NavContext);
}
