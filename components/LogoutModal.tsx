import React from 'react';
import { useBank } from '../context/BankContext';
import { LogOut, X } from 'lucide-react';

const LogoutModal: React.FC = () => {
  const { closeLogoutModal, logout, t } = useBank();

  const handleConfirm = () => {
    logout();
    closeLogoutModal();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in-up">
      <div className="glass-panel w-full max-w-sm rounded-2xl p-6 relative border border-white/10 shadow-2xl">
        <button 
          onClick={closeLogoutModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-2">
            <LogOut className="h-8 w-8 text-red-500" />
          </div>
          
          <h3 className="text-xl font-bold text-white">{t('logout.title')}</h3>
          <p className="text-gray-400 text-sm">
            {t('logout.message')}
          </p>

          <div className="flex w-full gap-3 mt-4">
            <button
              onClick={closeLogoutModal}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-800 text-white font-medium hover:bg-slate-700 transition-all border border-slate-700"
            >
              {t('logout.cancel')}
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 py-3 px-4 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
            >
              {t('logout.confirm')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;