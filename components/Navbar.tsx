
import React from 'react';
import { Menu, X, ShieldCheck, MessageSquare, Settings, LogIn } from 'lucide-react';
import { useBank } from '../context/BankContext';
import { APP_NAME } from '../constants';
import LanguageSelector from './LanguageSelector';

const Navbar: React.FC = () => {
  const { setView, currentUser, openLogoutModal, view, toggleChat, getUnreadCount, isChatOpen, t, language } = useBank();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleNavClick = (viewName: any) => {
    setView(viewName);
    setIsOpen(false);
  };

  const unreadCount = getUnreadCount();

  // Memoize NAV_LINKS to ensure re-render when language changes
  const NAV_LINKS = React.useMemo(() => [
    { label: t('nav.home'), view: 'LANDING' },
    { label: t('nav.about'), view: 'ABOUT' },
    { label: t('nav.services'), view: 'SERVICES' },
    { label: t('nav.pricing'), view: 'PRICING' },
    { label: t('nav.contact'), view: 'CONTACT' },
  ], [t, language]);

  return (
    <nav className="fixed w-full z-50 glass-panel border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div 
            className={`flex items-center ${!currentUser ? 'cursor-pointer' : ''} flex-shrink-0`} 
            onClick={() => !currentUser && setView('LANDING')}
          >
            <div className="flex-shrink-0 text-teal-300">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <div>
              <span className="ml-2 text-xl font-bold tracking-wider text-white">{APP_NAME}</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-baseline space-x-2">
              {!currentUser && NAV_LINKS.map((link) => (
                <button
                  key={link.label}
                  onClick={() => setView(link.view as any)}
                  className={`${view === link.view ? 'text-white bg-white/10' : 'text-gray-300 hover:text-white hover:bg-white/10'} px-3 py-2 rounded-md text-sm font-medium transition-all`}
                >
                  {link.label}
                </button>
              ))}
              
              {/* Language Selector Desktop */}
              <div className="ml-2 pl-2 border-l border-white/10">
                  <LanguageSelector />
              </div>

              {currentUser ? (
                <div className="flex items-center gap-4 ml-4">
                   <button 
                     onClick={toggleChat}
                     className={`relative p-2 rounded-full transition-colors ${isChatOpen ? 'bg-teal-400 text-white' : 'bg-slate-800 text-gray-300 hover:bg-slate-700 hover:text-white'}`}
                     title={t('nav.messages')}
                   >
                      <MessageSquare className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold min-w-[1rem] h-4 px-1 rounded-full flex items-center justify-center animate-bounce">
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                      )}
                   </button>

                   <span className="text-gray-300">{t('nav.hello')}, {currentUser.name}</span>
                   <button
                    onClick={openLogoutModal}
                    className="bg-red-500/20 hover:bg-red-500/40 text-red-300 px-4 py-2 rounded-md text-sm font-medium transition-all"
                  >
                    {t('nav.logout')}
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 ml-4">
                   <button
                    onClick={() => setView('LOGIN')}
                    className="text-white hover:bg-white/10 px-4 py-2 rounded-md text-sm font-medium transition-all"
                  >
                    {t('nav.login')}
                  </button>
                  <button
                    onClick={() => setView('REGISTER')}
                    className="bg-teal-400 hover:bg-teal-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-all shadow-lg shadow-teal-400/20"
                  >
                    {t('nav.register')}
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile Buttons */}
          <div className="-mr-2 flex md:hidden items-center gap-2 ml-3">
            {!currentUser && (
               <button
                onClick={() => setView('LOGIN')}
                className="text-white bg-teal-400 hover:bg-teal-500 p-2 rounded-md transition-all shadow-lg shadow-teal-400/20 border border-teal-300/50 flex items-center justify-center"
                title={t('nav.login')}
                aria-label={t('nav.login')}
              >
                <LogIn className="h-5 w-5" />
              </button>
            )}

            {/* Language Selector Mobile */}
            <LanguageSelector />
            
            {currentUser && (
                <button 
                  onClick={toggleChat}
                  className="relative p-2 rounded-full bg-slate-800 text-gray-300 mr-1"
                >
                  <MessageSquare className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden glass-panel">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {!currentUser && NAV_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.view)}
                className="w-full text-left text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                {link.label}
              </button>
            ))}
            {!currentUser ? (
               <>
                <button
                  onClick={() => { setView('REGISTER'); setIsOpen(false); }}
                  className="w-full text-left text-teal-300 font-bold block px-3 py-2 rounded-md text-base border border-teal-400/30 mt-2 bg-teal-400/10"
                >
                  {t('nav.register')}
                </button>
               </>
            ) : (
              <>
                {(view === 'DASHBOARD' || view === 'ADMIN') && (
                  <button
                    onClick={() => {
                      if (view === 'DASHBOARD') {
                        const event = new CustomEvent('openUserSettings');
                        window.dispatchEvent(event);
                      } else if (view === 'ADMIN') {
                        const event = new CustomEvent('openAdminSettings');
                        window.dispatchEvent(event);
                      }
                      setIsOpen(false);
                    }}
                    className="w-full text-left text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    {t('nav.settings')}
                  </button>
                )}
                <button
                  onClick={() => { openLogoutModal(); setIsOpen(false); }}
                  className="w-full text-left text-red-400 font-bold block px-3 py-2 rounded-md text-base"
                >
                  {t('nav.logout')}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
