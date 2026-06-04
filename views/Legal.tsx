import React from 'react';
import Footer from '../components/Footer';
import { Scale, Building2, Server, Shield } from 'lucide-react';
import { useBank } from '../context/BankContext';

const Legal: React.FC = () => {
  const { t } = useBank();
  return (
    <div className="bg-slate-900 min-h-screen pt-20">
      <div className="py-16 px-4 text-center">
        <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-700">
            <Scale className="h-8 w-8 text-teal-300" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{t('legal.title')}</h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
           {t('legal.subtitle')}
        </p>
      </div>

      <section className="py-12 px-4 max-w-5xl mx-auto space-y-8 pb-24">
        
        {/* Editeur */}
        <div className="glass-panel p-8 rounded-2xl border border-slate-700">
            <div className="flex items-center gap-4 mb-6">
                <Building2 className="h-6 w-6 text-teal-300" />
                <h2 className="text-2xl font-bold text-white">{t('legal.section1.title')}</h2>
            </div>
            <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                    {t('legal.section1.intro')}
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-400">
                    <li><strong>{t('legal.section1.item1.label')}</strong> {t('legal.section1.item1.value')}</li>
                    <li><strong>{t('legal.section1.item2.label')}</strong> {t('legal.section1.item2.value')}</li>
                    <li><strong>{t('legal.section1.item3.label')}</strong> {t('legal.section1.item3.value')}</li>
                    <li><strong>{t('legal.section1.item4.label')}</strong> {t('legal.section1.item4.value')}</li>
                    <li><strong>{t('legal.section1.item5.label')}</strong> {t('legal.section1.item5.value')}</li>
                    <li><strong>{t('legal.section1.item6.label')}</strong> {t('legal.section1.item6.value')}</li>
                </ul>
            </div>
        </div>

        {/* Hébergeur */}
        <div className="glass-panel p-8 rounded-2xl border border-slate-700">
            <div className="flex items-center gap-4 mb-6">
                <Server className="h-6 w-6 text-teal-300" />
                <h2 className="text-2xl font-bold text-white">{t('legal.section2.title')}</h2>
            </div>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {t('legal.section2.content')}
            </p>
        </div>

        {/* Propriété Intellectuelle */}
        <div className="glass-panel p-8 rounded-2xl border border-slate-700">
            <div className="flex items-center gap-4 mb-6">
                <Shield className="h-6 w-6 text-yellow-500" />
                <h2 className="text-2xl font-bold text-white">{t('legal.section3.title')}</h2>
            </div>
            <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                    {t('legal.section3.content1')}
                </p>
                <p>
                    {t('legal.section3.content2')}
                </p>
            </div>
        </div>

        {/* Responsabilité */}
        <div className="glass-panel p-8 rounded-2xl border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-4">{t('legal.section4.title')}</h2>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {t('legal.section4.content')}
            </p>
        </div>

      </section>

      <Footer />
    </div>
  );
};

export default Legal;