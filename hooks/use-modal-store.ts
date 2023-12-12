import { ChannelType, Server } from '@prisma/client'
import { create } from 'zustand'
export type ModalType = 'createServer' | 'invite' | 'editServer' | 'members' | 'createChannel' | 'leaveServer' | 'deleteServer'

interface ModalData {
  server?: Server
  channelType?: ChannelType
}

interface ModalStore {
  onOpen: (type: ModalType, data?: ModalData) => void
  onClose: () => void
  type: ModalType | null
  data: ModalData
  isOpen: boolean
}


export const useModalStore = create<ModalStore>((set) => ({
  onOpen: (type, data = {}) => set({ type, isOpen: true, data }),
  onClose: () => set({ type: null, isOpen: false }),
  type: null,
  data: {},
  isOpen: false
}))