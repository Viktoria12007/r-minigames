import Header from '../components/header/header.tsx';
import Footer from '../components/footer/footer.tsx';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header/>
            <main className='main'>{children}</main>
            <Footer/>
        </>
    )
}
