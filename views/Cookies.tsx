import React, { useState } from 'react';
import Footer from '../components/Footer';
import { Cookie, Check, X, Info, Settings } from 'lucide-react';
import { useBank } from '../context/BankContext';

const Cookies: React.FC = () => {
  const { t } = useBank();
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: true,
    marketing: false,
    preferences: true
  });

  const togglePreference = (key: keyof typeof preferences) => {
    if (key === 'essential') return; // Cannot toggle essential
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    // Logic to save cookies would go here
    alert(t('cookies.saved'));
  };

  return (
    <div className="bg-slate-900 min-h-screen pt-20">
      <div className="py-16 px-4 text-center">
        <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-700">
            <Cookie className="h-8 w-8 text-yellow-500" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{t('cookies.title')}</h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
           {t('cookies.subtitle')}
        </p>
      </div>

      <section className="py-12 px-4 max-w-4xl mx-auto pb-24">
        
        <div className="glass-panel rounded-2xl overflow-hidden border border-slate-700">
            <div className="p-6 md:p-8 border-b border-slate-700 bg-slate-800/50">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Settings className="h-6 w-6 text-gray-400" />
                    {t('cookies.preferences.title')}
                </h2>
                <p className="text-gray-400 mt-2">
                    {t('cookies.preferences.description')}
                </p>
            </div>

            <div className="divide-y divide-slate-700">
                
                {/* Essential */}
                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-white">{t('cookies.essential.title')}</h3>
                            <span className="text-[10px] font-bold uppercase bg-teal-400/20 text-teal-300 px-2 py-0.5 rounded border border-teal-400/30">{t('cookies.required')}</span>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            {t('cookies.essential.description')}
                        </p>
                    </div>
                    <div className="shrink-0">
                         <div className="w-14 h-8 bg-teal-400/50 rounded-full p-1 cursor-not-allowed opacity-80">
                            <div className="w-6 h-6 bg-white rounded-full shadow-md translate-x-6"></div>
                         </div>
                    </div>
                </div>

                {/* Analytics */}
                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center justify-between hover:bg-slate-800/30 transition-colors">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-white">{t('cookies.analytics.title')}</h3>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            {t('cookies.analytics.description')}
                        </p>
                    </div>
                    <div className="shrink-0">
                         <button 
                            onClick={() => togglePreference('analytics')}
                            className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${preferences.analytics ? 'bg-teal-400' : 'bg-slate-600'}`}
                        >
                            <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${preferences.analytics ? 'translate-x-6' : 'translate-x-0'}`}></div>
                         </button>
                    </div>
                </div>

                {/* Preferences */}
                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center justify-between hover:bg-slate-800/30 transition-colors">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-white">{t('cookies.functional.title')}</h3>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            {t('cookies.functional.description')}
                        </p>
                    </div>
                    <div className="shrink-0">
                         <button 
                            onClick={() => togglePreference('preferences')}
                            className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${preferences.preferences ? 'bg-teal-400' : 'bg-slate-600'}`}
                        >
                            <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${preferences.preferences ? 'translate-x-6' : 'translate-x-0'}`}></div>
                         </button>
                    </div>
                </div>

                {/* Marketing */}
                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center justify-between hover:bg-slate-800/30 transition-colors">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-white">{t('cookies.marketing.title')}</h3>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            {t('cookies.marketing.description')}
                        </p>
                    </div>
                    <div className="shrink-0">
                         <button 
                            onClick={() => togglePreference('marketing')}
                            className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${preferences.marketing ? 'bg-teal-400' : 'bg-slate-600'}`}
                        >
                            <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${preferences.marketing ? 'translate-x-6' : 'translate-x-0'}`}></div>
                         </button>
                    </div>
                </div>

            </div>

            <div className="p-6 md:p-8 bg-slate-800/50 flex flex-col sm:flex-row justify-end gap-4">
                <button 
                    onClick={() => setPreferences({ essential: true, analytics: false, marketing: false, preferences: false })}
                    className="px-6 py-3 rounded-xl border border-slate-600 text-white font-medium hover:bg-slate-700 transition-colors"
                >
                    {t('cookies.rejectAll')}
                </button>
                <button 
                    onClick={handleSave}
                    className="px-6 py-3 rounded-xl bg-teal-400 text-white font-bold hover:bg-teal-500 shadow-lg shadow-teal-400/20 transition-colors"
                >
                    {t('cookies.saveChoices')}
                </button>
            </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Cookies;