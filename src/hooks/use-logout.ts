import useSession from './use-session.ts';
import { useSnackbar } from './use-snackbar.ts';

export default function useLogout() {
  const { clearAppSession } = useSession();
  const { showSnackbar } = useSnackbar();

  async function handleLogout() {
    try {
      await clearAppSession();
    } catch {
      showSnackbar('You have been signed out, but Firebase could not confirm it.', 'error');
    }
  }

  return handleLogout;
}
