// components/Layout.tsx
import Header from './header';
import Footer from './footer';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Header />
      <main>{children}</main> {/* Main content of the page */}
      <Footer />
    </div>
  );
};

export default Layout;
