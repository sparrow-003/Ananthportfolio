import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ThemedBackground from './effects/ThemedBackground';
import MobileBottomNav from './MobileBottomNav';
import DeveloperConsole from './effects/DeveloperConsole';

const Layout = () => {
  const showDeveloperConsole = /lovable\.app$|lovableproject\.com$|lovableproject-dev\.com$|beta\.lovable\.dev$/.test(window.location.hostname);

  return (
    <div className="relative min-h-screen">
      {/* Fixed background sits at z-base; content above at z-content+. No transforms on ancestors so -z does not get clipped. */}
      <ThemedBackground />
      <Navbar />
      <main className="relative z-content pb-24 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
      {showDeveloperConsole ? <DeveloperConsole /> : null}
    </div>
  );
};

export default Layout;
