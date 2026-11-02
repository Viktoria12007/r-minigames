import { createPortal } from 'react-dom';
import Snackbar from '../snackbar/snackbar.tsx';
import type { SnackbarData } from '../../types/types.ts';

interface ISnackbarContainerProperties {
  snackbars: SnackbarData[];
  onClose: (id: string) => void;
}

export default function SnackbarContainer({ snackbars, onClose }: ISnackbarContainerProperties) {
  return createPortal(
    <div className="snackbar-list">
      {snackbars.map((snackbar) => (
        <Snackbar key={snackbar.id} {...snackbar} onClose={() => onClose(snackbar.id)} />
      ))}
    </div>,
    document.body,
  );
}
