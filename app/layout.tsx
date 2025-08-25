import './globals.css';
import Header from '../components/header';
import Footer from '../components/footer';

export const metadata = { title: 'CWA Assignment', description: 'Dynamic site with code generator' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <a href="#main" style={{position:'absolute',left:-9999}}>Skip to content</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
