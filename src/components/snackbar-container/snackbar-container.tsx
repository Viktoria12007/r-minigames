import { createPortal } from 'react-dom';
import Snackbar from '../snackbar/snackbar.tsx';
import type { SnackbarData } from '../../types/types.ts';

interface ISnackbarContainerProperties {
  snackbars: SnackbarData[];
  onClose: (id: string) => void;
}

export default function SnackbarContainer({ snackbars, onClose }: ISnackbarContainerProperties) {
  const app = document.querySelector<HTMLDivElement>('#app');
  return app
    ? createPortal(
        <div className="snackbar-list">
          {snackbars.map((snackbar) => (
            <Snackbar key={snackbar.id} {...snackbar} onClose={onClose} />
          ))}
        </div>,
        app,
      )
    : undefined;
}
