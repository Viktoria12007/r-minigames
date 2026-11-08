import { createContext, type ReactNode } from 'react';

type ModalWindowContextType = {
  openModalWindow: (options: ModalOptions) => void;
  closeModalWindow: () => void;
};

export type ModalOptions = {
  children: ReactNode;
  wide?: boolean;
  onClose?: () => void;
};

export const ModalWindowContext = createContext<ModalWindowContextType | null>(null);
