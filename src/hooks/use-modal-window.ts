import { useContext } from 'react';
import { ModalWindowContext } from '../context/modal-window-context.ts';

export default function useModalWindow() {
  const context = useContext(ModalWindowContext);

  if (!context) {
    throw new Error('useModalWindow must be used inside ModalWindowProvider');
  }

  return context;
}
