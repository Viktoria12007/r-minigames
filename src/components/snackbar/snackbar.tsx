import type { SnackbarData } from '../../types/types.ts';
import { useEffect } from 'react';

interface ISnackbarProperties extends SnackbarData {
  onClose: () => void;
}

export default function Snackbar({ text, variant, onClose }: ISnackbarProperties) {
  useEffect(() => {
    const timeoutId = setTimeout(onClose, 5000);

    return () => clearTimeout(timeoutId);
  }, [onClose]);

  return (
    <div className="snackbar" role="status" aria-live="polite" data-variant={variant}>
      <p className="snackbar__message">{text}</p>
      <button className="snackbar__close" aria-label="Dismiss notification" onClick={onClose}>
        ×
      </button>
    </div>
  );
}
