"use client"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export interface LoginFormDraft {
  username: string
  password: string
}

interface LoginFormStore {
  draft: LoginFormDraft
  setDraft: (draft: Partial<LoginFormDraft>) => void
  resetDraft: () => void
}

const defaultDraft: LoginFormDraft = {
  username: "admin",
  password: "admin123",
}

export const useLoginFormStore = create<LoginFormStore>()(
  persist(
    (set) => ({
      draft: defaultDraft,
      setDraft: (draft) =>
        set((state) => ({
          draft: {
            ...state.draft,
            ...draft,
          },
        })),
      resetDraft: () => set({ draft: defaultDraft }),
    }),
    {
      name: "community-grocery-admin-login-form",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ draft: state.draft }),
    },
  ),
)
