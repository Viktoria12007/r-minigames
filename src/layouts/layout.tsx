import Header from '../components/header/header.tsx';
import Footer from '../components/footer/footer.tsx';
import BurgerMenu from '../components/burger-menu/burger-menu.tsx';
import { Outlet } from 'react-router';

export default function Layout() {
  return (
    <>
      <Header />
      <BurgerMenu />
      <main className="main container">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
