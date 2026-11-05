import { useLocation } from 'react-router';

export default function useIsHomeActive() {
  const { pathname } = useLocation();
  return pathname === '/' || pathname === '/home';
}
