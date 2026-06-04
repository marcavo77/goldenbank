import React from 'react';
import { useBank } from '../context/BankContext';
import { Smartphone, X, ArrowRight } from 'lucide-react';

const AppDownloadModal: React.FC = () => {
  const { closeAppDownloadModal, setView, t } = useBank();

  const handleCreateAccount = () => {
    closeAppDownloadModal();
    setView('REGISTER', true);
  };

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in-up"
      onClick={closeAppDownloadModal}
    >
      <div 
        className="glass-panel w-full max-w-md rounded-2xl p-8 relative border border-white/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeAppDownloadModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="flex flex-col items-center text-center space-y-6">
          {/* Smartphone Icon */}
          <div className="relative">
            <div className="w-20 h-20 bg-teal-400/20 rounded-full flex items-center justify-center mb-2">
              <Smartphone className="h-12 w-12 text-teal-300" />
            </div>
          </div>
          
          {/* Title */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">{t('appDownloadModal.title')}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t('appDownloadModal.message')}
            </p>
          </div>

          {/* Create Account Button */}
          <button
            onClick={handleCreateAccount}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold hover:from-teal-500 hover:to-teal-600 transition-all shadow-lg shadow-teal-400/30 transform hover:scale-105 duration-200 flex items-center justify-center gap-2"
          >
            {t('appDownloadModal.createAccount')}
            <ArrowRight className="h-5 w-5" />
          </button>

          {/* Cancel Button */}
          <button
            onClick={closeAppDownloadModal}
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            {t('appDownloadModal.cancel')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppDownloadModal;

