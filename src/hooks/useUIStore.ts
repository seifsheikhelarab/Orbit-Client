import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ViewMode = 'kanban' | 'table';

interface UIPreferences {
  viewMode: ViewMode;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface UIState extends UIPreferences {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setViewMode: (mode: ViewMode) => void;
  setSortPrefs: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      viewMode: 'kanban',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setViewMode: (mode) => set({ viewMode: mode }),
      setSortPrefs: (sortBy, sortOrder) => set({ sortBy, sortOrder }),
    }),
    {
      name: 'orbit-ui-store',
      partialize: (state) => ({
        viewMode: state.viewMode,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
      }),
    }
  )
);
