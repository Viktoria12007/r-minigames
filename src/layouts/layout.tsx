import Header from '../components/header/header.tsx';
import Footer from '../components/footer/footer.tsx';
import { Outlet } from 'react-router';
import { ModalWindowProvider } from '../provider/modal-window-provider.tsx';

export default function Layout() {
  return (
    <ModalWindowProvider>
      <Header />
      <main className="main container">
        <Outlet />
      </main>
      <Footer />
    </ModalWindowProvider>
  );
}
