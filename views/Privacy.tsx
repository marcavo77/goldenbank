import React from 'react';
import Footer from '../components/Footer';
import { Lock, Eye, FileText, Database, UserCheck, Mail } from 'lucide-react';
import { useBank } from '../context/BankContext';

const Privacy: React.FC = () => {
  const { t } = useBank();
  return (
    <div className="bg-slate-900 min-h-screen pt-20">
      <div className="py-16 px-4 text-center">
         <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-700">
            <Lock className="h-8 w-8 text-teal-300" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{t('privacy.title')}</h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
           {t('privacy.subtitle')}
        </p>
      </div>

      <section className="py-12 px-4 max-w-5xl mx-auto space-y-12 pb-24">

         {/* Intro */}
         <div className="text-gray-300 text-lg leading-relaxed border-l-4 border-teal-400 pl-6">
            <p>
                {t('privacy.intro')}
            </p>
         </div>

         {/* Section 1: Données collectées */}
         <div>
            <div className="flex items-center gap-3 mb-6">
               <Database className="h-6 w-6 text-teal-300" />
               <h2 className="text-2xl font-bold text-white">{t('privacy.section1.title')}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-6 rounded-xl border border-slate-700">
                    <h3 className="font-bold text-white mb-3">{t('privacy.section1.data1.title')}</h3>
                    <p className="text-gray-400 text-sm">{t('privacy.section1.data1.desc')}</p>
                </div>
                <div className="glass-panel p-6 rounded-xl border border-slate-700">
                    <h3 className="font-bold text-white mb-3">{t('privacy.section1.data2.title')}</h3>
                    <p className="text-gray-400 text-sm">{t('privacy.section1.data2.desc')}</p>
                </div>
                <div className="glass-panel p-6 rounded-xl border border-slate-700">
                    <h3 className="font-bold text-white mb-3">{t('privacy.section1.data3.title')}</h3>
                    <p className="text-gray-400 text-sm">{t('privacy.section1.data3.desc')}</p>
                </div>
                <div className="glass-panel p-6 rounded-xl border border-slate-700">
                    <h3 className="font-bold text-white mb-3">{t('privacy.section1.data4.title')}</h3>
                    <p className="text-gray-400 text-sm">{t('privacy.section1.data4.desc')}</p>
                </div>
            </div>
         </div>

         {/* Section 2: Utilisation */}
         <div className="glass-panel p-8 rounded-2xl border border-slate-700">
            <div className="flex items-center gap-3 mb-6">
               <FileText className="h-6 w-6 text-yellow-500" />
               <h2 className="text-2xl font-bold text-white">{t('privacy.section2.title')}</h2>
            </div>
            <p className="text-gray-300 mb-4">{t('privacy.section2.intro')}</p>
            <ul className="space-y-3 text-gray-400">
                <li className="flex gap-3"><span className="text-teal-400">•</span> {t('privacy.section2.use1')}</li>
                <li className="flex gap-3"><span className="text-teal-400">•</span> {t('privacy.section2.use2')}</li>
                <li className="flex gap-3"><span className="text-teal-400">•</span> {t('privacy.section2.use3')}</li>
                <li className="flex gap-3"><span className="text-teal-400">•</span> {t('privacy.section2.use4')}</li>
            </ul>
         </div>

         {/* Section 3: Droits */}
         <div className="glass-panel p-8 rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900">
            <div className="flex items-center gap-3 mb-6">
               <UserCheck className="h-6 w-6 text-teal-300" />
               <h2 className="text-2xl font-bold text-white">{t('privacy.section3.title')}</h2>
            </div>
            <p className="text-gray-300 mb-6">{t('privacy.section3.intro')}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="p-4 bg-slate-900/50 rounded-lg text-gray-300 border border-slate-700">
                    <strong className="text-white block mb-1">{t('privacy.section3.right1.title')}</strong>
                    {t('privacy.section3.right1.desc')}
                </div>
                <div className="p-4 bg-slate-900/50 rounded-lg text-gray-300 border border-slate-700">
                    <strong className="text-white block mb-1">{t('privacy.section3.right2.title')}</strong>
                    {t('privacy.section3.right2.desc')}
                </div>
                <div className="p-4 bg-slate-900/50 rounded-lg text-gray-300 border border-slate-700">
                    <strong className="text-white block mb-1">{t('privacy.section3.right3.title')}</strong>
                    {t('privacy.section3.right3.desc')}
                </div>
                <div className="p-4 bg-slate-900/50 rounded-lg text-gray-300 border border-slate-700">
                    <strong className="text-white block mb-1">{t('privacy.section3.right4.title')}</strong>
                    {t('privacy.section3.right4.desc')}
                </div>
            </div>
         </div>

         {/* Contact DPO */}
         <div className="text-center bg-slate-800 p-8 rounded-2xl border border-teal-400/30">
            <h2 className="text-2xl font-bold text-white mb-4">{t('privacy.dpo.title')}</h2>
            <p className="text-gray-400 mb-6">
                {t('privacy.dpo.description')}
            </p>
            <a href="mailto:dpo@goldenbank.com" className="inline-flex items-center gap-2 bg-teal-400 hover:bg-teal-500 text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg shadow-teal-400/20">
                <Mail className="h-5 w-5" /> dpo@goldenbank.com
            </a>
         </div>

      </section>

      <Footer />
    </div>
  );
};

export default Privacy;