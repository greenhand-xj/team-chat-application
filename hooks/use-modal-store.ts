import { create } from 'zustand'
export type ModalType = 'createServer'

interface ModalStore {
  onOpen: (type: ModalType) => void
  onClose: () => void
  type: ModalType | null
  isOpen: boolean
}


export const useModalStore = create<ModalStore>((set) => ({
  onOpen: (type) => set({ type, isOpen: true }),
  onClose: () => set({ type: null, isOpen: false }),
  type: null,
  isOpen: false
}))