import { type ReactNode, useEffect, useRef } from 'react';
import type { MouseEvent } from 'react';
import * as React from 'react';

export type IModalProperties = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
};

export default function ModalWindow({ isOpen, onClose, children, wide = true }: IModalProperties) {
  const modalWindowReference = useRef<HTMLDialogElement>(null);
  const [shouldRenderChildren, setShouldRenderChildren] = React.useState(true);

  useEffect(() => {
    const modalWindow = modalWindowReference.current;
    if (!modalWindow) return;

    if (isOpen && !modalWindow.open) {
      setShouldRenderChildren(true);
      modalWindow.showModal();
    } else if (!isOpen && modalWindow.open) {
      modalWindow.close();
    }

    return () => {
      if (modalWindow.open) {
        modalWindow.close();
      }
    };
  }, [isOpen]);

  function onCloseModalWindow() {
    const modalWindow = modalWindowReference.current;
    if (!modalWindow) return;

    if (modalWindow.open) {
      modalWindow.close();
    }
  }

  function onBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  const handleTransitionEnd = (event: React.TransitionEvent<HTMLDialogElement>) => {
    if (!isOpen && event.target === event.currentTarget && event.propertyName === 'opacity') {
      setShouldRenderChildren(false);
    }
  };

  return (
    <dialog
      ref={modalWindowReference}
      className={`modal-window ${wide ? 'modal-window_wide' : ''}`}
      onClose={onClose}
      onClick={onBackdropClick}
      onTransitionEnd={handleTransitionEnd}
    >
      <div className={`modal-window__content ${wide ? 'modal-window__content_wide' : ''}`}>
        <button
          className="modal-window__close"
          aria-label="Close modal-window"
          onClick={onCloseModalWindow}
        >
          ×
        </button>
        {shouldRenderChildren && children}
      </div>
    </dialog>
  );
}
