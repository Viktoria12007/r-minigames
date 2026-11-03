import Header from '../components/header/header.tsx';
import Footer from '../components/footer/footer.tsx';
import BurgerMenu from '../components/burger-menu/burger-menu.tsx';
import * as React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <BurgerMenu />
      <main className="main">{children}</main>
      <Footer />
    </>
  );
}
