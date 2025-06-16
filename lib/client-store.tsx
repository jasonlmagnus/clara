'use client'

import { createStore, useStore } from 'zustand'
import { createContext, useContext, useRef, ReactNode } from 'react'

interface ClientState {
  clients: string[]
  selectedClient: string | null
  setClients: (clients: string[]) => void
  setSelectedClient: (client: string | null) => void
  fetchClients: () => Promise<void>
}

function initClientStore(initState?: Partial<ClientState>) {
  return createStore<ClientState>((set) => ({
    clients: [],
    selectedClient: null,
    setClients: (clients) => set({ clients }),
    setSelectedClient: (client) => set({ selectedClient: client }),
    fetchClients: async () => {
      try {
        const res = await fetch('/api/clients')
        if (res.ok) {
          const data = await res.json()
          set({ clients: data })
        }
      } catch (err) {
        console.error('Failed to fetch clients', err)
      }
    },
    ...initState,
  }))
}

const ClientStoreContext = createContext<ReturnType<typeof initClientStore> | null>(null)

export function ClientProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<ReturnType<typeof initClientStore>>()
  if (!storeRef.current) {
    storeRef.current = initClientStore()
  }
  return <ClientStoreContext.Provider value={storeRef.current}>{children}</ClientStoreContext.Provider>
}

export function useClientStore<T>(selector: (state: ClientState) => T) {
  const store = useContext(ClientStoreContext)
  if (!store) throw new Error('useClientStore must be used within ClientProvider')
  return useStore(store, selector)
}
