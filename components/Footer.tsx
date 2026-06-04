
import React from 'react';
import { useBank } from '../context/BankContext';

const Footer: React.FC = () => {
  const { setView, t } = useBank();

  return (
    <footer className="bg-slate-950 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold text-teal-400 mb-4 cursor-pointer" onClick={() => setView('LANDING')}>Golden Bank</h2>
        <p className="text-gray-400 mb-8">{t('footer.slogan')}</p>
        <div className="flex justify-center space-x-6 mb-8">
          <a href="#" className="text-gray-400 hover:text-white transition-colors">{t('footer.social.twitter')}</a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">{t('footer.social.instagram')}</a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">{t('footer.social.linkedin')}</a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">{t('footer.social.facebook')}</a>
        </div>
        <div className="flex justify-center flex-wrap gap-x-8 gap-y-4 text-sm text-gray-500 mb-8">
          <button onClick={() => setView('LEGAL')} className="hover:text-gray-300 transition-colors">{t('footer.legal')}</button>
          <button onClick={() => setView('PRIVACY')} className="hover:text-gray-300 transition-colors">{t('footer.privacy')}</button>
          <button onClick={() => setView('COOKIES')} className="hover:text-gray-300 transition-colors">{t('footer.cookies')}</button>
        </div>
        <p className="text-gray-600 text-sm">© {new Date().getFullYear()} Golden Bank Corporation. {t('footer.rights')}</p>
      </div>
    </footer>
  );
};

export default Footer;
