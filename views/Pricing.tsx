import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import { useBank } from '../context/BankContext';
import { TrendingUp, Calculator, PieChart } from 'lucide-react';
import { CURRENCY } from '../constants';

const Pricing: React.FC = () => {
  const { setView, t } = useBank();
  
  // Simulator State
  const [deposit, setDeposit] = useState(1000);
  const [years, setYears] = useState(5);
  const [results, setResults] = useState<{ standard: number; premium: number; elite: number }>({ standard: 0, premium: 0, elite: 0 });

  const RATES = {
    standard: 0.005, // 0.5%
    premium: 0.02,   // 2.0%
    elite: 0.04      // 4.0%
  };

  useEffect(() => {
    // Compound interest calculation: A = P(1 + r)^t
    const calculate = (rate: number) => {
      return deposit * Math.pow(1 + rate, years);
    };

    setResults({
      standard: calculate(RATES.standard),
      premium: calculate(RATES.premium),
      elite: calculate(RATES.elite)
    });
  }, [deposit, years]);

  const formatMoney = (amount: number) => {
    // Use browser locale for number formatting
    return amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ' + CURRENCY;
  };

  return (
    <div className="bg-slate-900 min-h-screen pt-20">
      <div className="py-16 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">{t('pricing.pageTitle')}</h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {t('pricing.subtitle')}
        </p>
      </div>

      {/* Pricing Cards */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
             {/* Free */}
             <div className="glass-panel p-8 rounded-2xl border-t-4 border-gray-500 hover:-translate-y-2 transition-transform duration-300">
               <h3 className="text-2xl font-bold text-white mb-2">{t('pricing.std')}</h3>
               <div className="text-4xl font-bold text-teal-300 mb-6">0 {CURRENCY}<span className="text-sm text-gray-500 font-normal">{t('common.month')}</span></div>
               <p className="text-gray-400 text-sm mb-6">{t('pricing.std.desc')}</p>
               <div className="mb-6 p-3 bg-slate-800 rounded-lg border border-slate-700">
                  <span className="text-teal-300 font-bold">0.5%</span> <span className="text-gray-400 text-sm">{t('pricing.interestRate')}</span>
               </div>
               <ul className="space-y-4 text-gray-300 mb-8">
                 <li className="flex items-center gap-2">✓ {t('pricing.std.feature1')}</li>
                 <li className="flex items-center gap-2">✓ {t('pricing.std.feature2')}</li>
                 <li className="flex items-center gap-2">✓ {t('pricing.std.feature3')}</li>
                 <li className="flex items-center gap-2 text-gray-600">✕ {t('pricing.std.feature4')}</li>
                 <li className="flex items-center gap-2 text-gray-600">✕ {t('pricing.std.feature5')}</li>
                 <li className="flex items-center gap-2 text-gray-600">✕ {t('pricing.std.feature6')}</li>
               </ul>
               <button onClick={() => setView('REGISTER')} className="w-full py-3 rounded-xl bg-slate-700 text-white font-bold hover:bg-slate-600 transition-all">{t('pricing.chooseStd')}</button>
             </div>
             
             {/* Premium */}
             <div className="glass-panel p-8 rounded-2xl border-t-4 border-teal-400 relative transform md:-translate-y-4 hover:-translate-y-6 transition-transform duration-300 z-10 shadow-2xl shadow-teal-400/10">
               <div className="absolute top-0 right-0 bg-teal-400 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">{t('pricing.popular')}</div>
               <h3 className="text-2xl font-bold text-white mb-2">{t('pricing.prem')}</h3>
               <div className="text-4xl font-bold text-teal-300 mb-6">9.99 {CURRENCY}<span className="text-sm text-gray-500 font-normal">{t('common.month')}</span></div>
               <p className="text-gray-400 text-sm mb-6">{t('pricing.prem.desc')}</p>
               <div className="mb-6 p-3 bg-teal-400/10 rounded-lg border border-teal-400/30">
                  <span className="text-teal-300 font-bold">2.0%</span> <span className="text-gray-400 text-sm">{t('pricing.interestRate')}</span>
               </div>
               <ul className="space-y-4 text-gray-300 mb-8">
                 <li className="flex items-center gap-2 text-white">✓ {t('pricing.prem.feature1')}</li>
                 <li className="flex items-center gap-2 text-white">✓ {t('pricing.prem.feature2')}</li>
                 <li className="flex items-center gap-2 text-white">✓ {t('pricing.prem.feature4')}</li>
                 <li className="flex items-center gap-2 text-white">✓ {t('pricing.prem.feature5')}</li>
                 <li className="flex items-center gap-2 text-white">✓ {t('pricing.prem.feature6')}</li>
                 <li className="flex items-center gap-2 text-gray-600">✕ {t('pricing.prem.feature7')}</li>
               </ul>
               <button onClick={() => setView('REGISTER')} className="w-full py-3 rounded-xl bg-teal-400 text-white font-bold hover:bg-teal-500 transition-all shadow-lg shadow-teal-400/20">{t('pricing.choosePrem')}</button>
             </div>
             
             {/* Metal */}
             <div className="glass-panel p-8 rounded-2xl border-t-4 border-yellow-500 hover:-translate-y-2 transition-transform duration-300">
               <h3 className="text-2xl font-bold text-white mb-2">{t('pricing.elite')}</h3>
               <div className="text-4xl font-bold text-teal-300 mb-6">16.99 {CURRENCY}<span className="text-sm text-gray-500 font-normal">{t('common.month')}</span></div>
               <p className="text-gray-400 text-sm mb-6">{t('pricing.elite.desc')}</p>
               <div className="mb-6 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                  <span className="text-yellow-400 font-bold">4.0%</span> <span className="text-gray-400 text-sm">{t('pricing.interestRate')}</span>
               </div>
               <ul className="space-y-4 text-gray-300 mb-8">
                 <li className="flex items-center gap-2 text-white">✓ {t('pricing.elite.feature1')}</li>
                 <li className="flex items-center gap-2 text-white">✓ {t('pricing.elite.feature2')}</li>
                 <li className="flex items-center gap-2 text-white">✓ {t('pricing.elite.feature3')}</li>
                 <li className="flex items-center gap-2 text-white">✓ {t('pricing.elite.feature4')}</li>
                 <li className="flex items-center gap-2 text-white">✓ {t('pricing.elite.feature5')}</li>
                 <li className="flex items-center gap-2 text-white">✓ {t('pricing.elite.feature6')}</li>
               </ul>
               <button onClick={() => setView('REGISTER')} className="w-full py-3 rounded-xl bg-slate-700 text-white font-bold hover:bg-slate-600 transition-all">{t('pricing.chooseElite')}</button>
             </div>
          </div>
        </div>
      </section>

      {/* Simulator Section */}
      <section className="py-24 px-4 bg-slate-800/50">
        <div className="max-w-5xl mx-auto">
           <div className="flex items-center justify-center gap-3 mb-10">
              <Calculator className="h-8 w-8 text-teal-300" />
              <h2 className="text-3xl font-bold text-white">{t('pricing.simulator.title')}</h2>
           </div>

           <div className="glass-panel p-8 md:p-12 rounded-3xl grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                 <div>
                    <label className="flex justify-between text-gray-300 font-medium mb-4">
                       <span>{t('pricing.simulator.initialDeposit')}</span>
                       <span className="text-teal-300 font-bold">{formatMoney(deposit)}</span>
                    </label>
                    <input 
                      type="range" 
                      min="100" 
                      max="100000" 
                      step="100" 
                      value={deposit}
                      onChange={(e) => setDeposit(Number(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-400"
                    />
                 </div>

                 <div>
                    <label className="flex justify-between text-gray-300 font-medium mb-4">
                       <span>{t('pricing.simulator.duration')}</span>
                       <span className="text-teal-300 font-bold">{years} {t('pricing.simulator.years')}</span>
                    </label>
                    <input 
                      type="range" 
                      min="1" 
                      max="30" 
                      step="1" 
                      value={years}
                      onChange={(e) => setYears(Number(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-400"
                    />
                 </div>

                 <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700">
                    <h4 className="text-gray-400 mb-4 flex items-center gap-2">
                       <PieChart className="h-4 w-4" /> {t('pricing.simulator.analysis')}
                    </h4>
                    <p className="text-sm text-gray-500">
                       {t('pricing.simulator.description')}
                    </p>
                 </div>
              </div>

              <div className="space-y-4">
                 <h3 className="text-white font-bold mb-6">{t('pricing.simulator.projection')} {years} {t('pricing.simulator.years')}</h3>
                 
                 {/* Standard Result */}
                 <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex justify-between items-center opacity-70">
                    <div>
                       <div className="text-gray-400 text-sm">{t('pricing.simulator.accountStd')}</div>
                       <div className="text-white font-bold text-xl">{formatMoney(results.standard)}</div>
                    </div>
                    <div className="text-right text-teal-300 text-sm">
                       +{formatMoney(results.standard - deposit)}
                    </div>
                 </div>

                 {/* Premium Result */}
                 <div className="bg-slate-800 p-4 rounded-xl border border-teal-400/30 flex justify-between items-center relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-400"></div>
                    <div>
                       <div className="text-gray-300 text-sm">{t('pricing.simulator.accountPrem')}</div>
                       <div className="text-white font-bold text-xl">{formatMoney(results.premium)}</div>
                    </div>
                    <div className="text-right text-teal-300 text-sm font-bold">
                       +{formatMoney(results.premium - deposit)}
                    </div>
                 </div>

                 {/* Elite Result */}
                 <div className="bg-gradient-to-r from-yellow-900/20 to-slate-800 p-4 rounded-xl border border-yellow-500/50 flex justify-between items-center relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500"></div>
                    <div className="absolute right-0 top-0 text-[10px] font-bold bg-yellow-500 text-black px-2 py-1 rounded-bl-lg">{t('pricing.simulator.bestReturn')}</div>
                    <div>
                       <div className="text-yellow-100 text-sm">{t('pricing.simulator.accountElite')}</div>
                       <div className="text-yellow-400 font-bold text-2xl">{formatMoney(results.elite)}</div>
                    </div>
                    <div className="text-right text-yellow-400 text-sm font-bold pt-4">
                       +{formatMoney(results.elite - deposit)}
                    </div>
                 </div>

                 <div className="mt-6 text-center">
                    <button onClick={() => setView('REGISTER')} className="text-teal-300 hover:text-teal-200 underline font-medium">
                       {t('pricing.simulator.startSaving')}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;