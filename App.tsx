import React, { useEffect } from 'react';
import MaintenancePage from './views/MaintenancePage';
import { BankProvider, useBank } from './context/BankContext';
import Navbar from './components/Navbar';
import LandingPage from './views/LandingPage';
import { Auth } from './views/Auth';
import UserDashboard from './views/UserDashboard';
import AdminDashboard from './views/AdminDashboard';
import About from './views/About';
import Services from './views/Services';
import Pricing from './views/Pricing';
import Contact from './views/Contact';
import Legal from './views/Legal';
import Privacy from './views/Privacy';
import Cookies from './views/Cookies';
import LogoutModal from './components/LogoutModal';
import SuccessModal from './components/SuccessModal';
import AppDownloadModal from './components/AppDownloadModal';
import TransactionSuccessModal from './components/TransactionSuccessModal';
import ChatWidget from './components/ChatWidget';

const AppContent: React.FC = () => {
  const { view, isLogoutModalOpen, isSuccessModalOpen, isAppDownloadModalOpen, isTransactionSuccessModalOpen, reloadUserData, language } = useBank();

  // Scroll to top whenever the view changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  // Update HTML lang attribute when language changes
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // Reload is now handled in BankContext to avoid double calls

  let content;
  switch (view) {
    case 'LOGIN':
    case 'REGISTER':
      content = <Auth />;
      break;
    case 'DASHBOARD':
      content = <UserDashboard />;
      break;
    case 'ADMIN':
      content = <AdminDashboard />;
      break;
    case 'ABOUT':
      content = <About />;
      break;
    case 'SERVICES':
      content = <Services />;
      break;
    case 'PRICING':
      content = <Pricing />;
      break;
    case 'CONTACT':
      content = <Contact />;
      break;
    case 'LEGAL':
      content = <Legal />;
      break;
    case 'PRIVACY':
      content = <Privacy />;
      break;
    case 'COOKIES':
      content = <Cookies />;
      break;
    case 'LANDING':
    default:
      content = <LandingPage />;
      break;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-teal-400 selection:text-white relative">
      <Navbar />
      <main>
        {content}
      </main>
      <ChatWidget />
      {isLogoutModalOpen && <LogoutModal />}
      {isSuccessModalOpen && <SuccessModal />}
      {isAppDownloadModalOpen && <AppDownloadModal />}
      {isTransactionSuccessModalOpen && <TransactionSuccessModal />}
    </div>
  );
};

const App: React.FC = () => {
  // Mettre à false pour désactiver le mode maintenance
  const MAINTENANCE_MODE = false;

  if (MAINTENANCE_MODE) {
    return <MaintenancePage />;
  }

  return (
    <BankProvider>
      <AppContent />
    </BankProvider>
  );
};

export default App;