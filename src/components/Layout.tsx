import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ThemedBackground from './effects/ThemedBackground';
import MobileBottomNav from './MobileBottomNav';
import DeveloperConsole from './effects/DeveloperConsole';

const Layout = () => {
  return (
    <div className="relative min-h-screen">
      {/* Fixed background sits at z=0; content above at z=10+. No transforms on ancestors so -z does not get clipped. */}
      <ThemedBackground />
      <Navbar />
      <main className="relative z-[10] pb-24 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
      <DeveloperConsole />
    </div>
  );
};

export default Layout;
