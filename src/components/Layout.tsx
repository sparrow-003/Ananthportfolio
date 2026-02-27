 import { Outlet } from 'react-router-dom';
 import { Suspense, lazy } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

 // Lazy load themed background
 const ThemedBackground = lazy(() => import('./effects/ThemedBackground'));

const Layout = () => {
  return (
    <>
      <Suspense fallback={null}>
         <ThemedBackground />
      </Suspense>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
