import { type ReactNode, useCallback, useMemo, useState } from 'react';
import ModalWindow from '../components/modal-window/modal-window.tsx';
import { type ModalOptions, ModalWindowContext } from '../context/modal-window-context.ts';

type ModalState = ModalOptions & {
  isOpen: boolean;
};

export function ModalWindowProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<ModalState | null>(null);

  const openModalWindow = useCallback((options: ModalOptions) => {
    setModal({ ...options, isOpen: true });
  }, []);

  const closeModalWindow = useCallback(() => {
    setModal((previous) => {
      return previous
        ? {
            ...previous,
            isOpen: false,
          }
        : previous;
    });
  }, []);

  const contextValue = useMemo(
    () => ({
      openModalWindow,
      closeModalWindow,
    }),
    [openModalWindow, closeModalWindow],
  );

  return (
    <ModalWindowContext.Provider value={contextValue}>
      {children}
      <ModalWindow isOpen={modal?.isOpen ?? false} onClose={closeModalWindow} wide={modal?.wide}>
        {modal?.children}
      </ModalWindow>
    </ModalWindowContext.Provider>
  );
}
