import { useState } from 'react';

import { create } from 'zustand'


type CreateTourDialog = {
  isOpen: boolean
  setIsOpen: (newState: boolean) => void
}

export const useCreateTourDialog = create<CreateTourDialog>()((set) => ({
  isOpen: false,
  setIsOpen: (newState) => set((state) => ({ isOpen: newState })),
}))
