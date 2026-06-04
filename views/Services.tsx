import React, { useMemo } from 'react';
import Footer from '../components/Footer';
import { useBank } from '../context/BankContext';
import { 
  Globe, Lock, Smartphone, CreditCard, Shield, Zap, RefreshCw, BarChart, 
  Check, X as XIcon, ArrowRight, Wallet, Bitcoin, TrendingUp, Layers,
  Cpu, Wifi, Key
} from 'lucide-react';

const Services: React.FC = () => {
  const { setView, t, language } = useBank();

  return (
    <div className="bg-slate-900 min-h-screen pt-20 overflow-hidden">
      
      {/* Hero Section */}
      <div className="py-20 px-4 text-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-teal-400/10 rounded-full blur-[120px] -z-10"></div>
        <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 tracking-tight">
          {t('services.title')} <span className="text-teal-300">Golden Bank</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            {t('services.subtitle')}
        </p>
      </div>

      {/* Grid Overview */}
      <section className="py-12 px-4 bg-slate-800/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {useMemo(() => [
              { icon: Globe, title: t('services.feature1.title'), desc: t('services.feature1.desc') },
              { icon: Lock, title: t('services.feature2.title'), desc: t('services.feature2.desc') },
              { icon: Smartphone, title: t('services.feature3.title'), desc: t('services.feature3.desc') },
              { icon: CreditCard, title: t('services.feature4.title'), desc: t('services.feature4.desc') },
              { icon: Shield, title: t('services.feature5.title'), desc: t('services.feature5.desc') },
              { icon: Zap, title: t('services.feature6.title'), desc: t('services.feature6.desc') },
              { icon: RefreshCw, title: t('services.feature7.title'), desc: t('services.feature7.desc') },
              { icon: BarChart, title: t('services.feature8.title'), desc: t('services.feature8.desc') }
            ], [t, language]).map((service, idx) => (
              <div key={idx} className="glass-panel p-8 rounded-2xl hover:bg-slate-700/50 transition-all duration-300 group cursor-default border border-slate-700 hover:border-teal-400/30">
                <div className="w-14 h-14 rounded-xl bg-slate-700/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-teal-400/20">
                  <service.icon className="h-7 w-7 text-teal-300" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{service.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deep Dive Section 1: The App Experience */}
      <section className="py-24 px-4 relative">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
           <div className="flex-1 space-y-8">
              <div className="inline-block px-4 py-2 bg-teal-400/10 rounded-full border border-teal-400/20 text-teal-300 text-sm font-bold uppercase tracking-wider">
                {t('services.userExperience')}
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                {t('services.ux.title')}<br/><span className="text-teal-300">{t('services.ux.titleHighlight')}</span>.
              </h2>
              <p className="text-lg text-gray-400">
                {t('services.ux.description')}
              </p>
              
              <div className="space-y-6 pt-4">
                 {useMemo(() => [
                   { title: t('services.ux.feature1.title'), desc: t('services.ux.feature1.desc') },
                   { title: t('services.ux.feature2.title'), desc: t('services.ux.feature2.desc') },
                   { title: t('services.ux.feature3.title'), desc: t('services.ux.feature3.desc') }
                 ], [t, language]).map((item, i) => (
                   <div key={i} className="flex gap-4">
                      <div className="mt-1 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                         <span className="text-teal-300 font-bold">{i + 1}</span>
                      </div>
                      <div>
                         <h4 className="text-white font-bold text-lg">{item.title}</h4>
                         <p className="text-gray-500">{item.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
           
           <div className="flex-1 relative">
              <div className="absolute inset-0 bg-teal-400/20 blur-[100px] rounded-full"></div>
              {/* Mock App UI Visual */}
              <div className="relative z-10 bg-slate-900 border-8 border-slate-800 rounded-[2.5rem] p-4 shadow-2xl max-w-sm mx-auto rotate-[-5deg] hover:rotate-0 transition-transform duration-700">
                  <div className="bg-slate-800 rounded-[2rem] overflow-hidden h-[600px] flex flex-col relative">
                      {/* Header */}
                      <div className="bg-slate-900 p-6 pb-4">
                         <div className="flex justify-between items-center text-white mb-6">
                            <div className="w-8 h-8 bg-slate-700 rounded-full"></div>
                            <div className="font-bold">{t('services.app.home')}</div>
                            <div className="w-8 h-8 flex items-center justify-center"><Zap className="h-5 w-5 text-teal-300"/></div>
                         </div>
                         <div className="text-gray-400 text-sm">{t('services.app.balance')}</div>
                         <div className="text-4xl font-bold text-white">12 450,00 €</div>
                      </div>
                      {/* Chart Area */}
                      <div className="h-32 bg-slate-900/50 flex items-end px-4 gap-2 pb-4">
                         {[40, 60, 35, 80, 50, 90, 70].map((h, i) => (
                             <div key={i} className="flex-1 bg-teal-400/20 rounded-t-sm relative group">
                                <div className={`absolute bottom-0 left-0 right-0 bg-teal-400 rounded-t-sm transition-all duration-1000`} style={{height: `${h}%`}}></div>
                             </div>
                         ))}
                      </div>
                      {/* List */}
                      <div className="flex-1 bg-slate-800 p-4 space-y-4">
                         {[
                             { name: "Starbucks", amount: "-4.50 €", icon: "☕️" },
                             { name: "Uber", amount: "-12.20 €", icon: "🚗" },
                             { name: "Salaire", amount: "+3 200.00 €", icon: "💰", color: "text-teal-300" },
                             { name: "Netflix", amount: "-15.99 €", icon: "🎬" },
                         ].map((item, i) => (
                             <div key={i} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl">
                                <div className="flex items-center gap-3">
                                   <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-xl">{item.icon}</div>
                                   <div className="text-white font-medium">{item.name}</div>
                                </div>
                                <div className={`font-bold ${item.color || 'text-white'}`}>{item.amount}</div>
                             </div>
                         ))}
                      </div>
                  </div>
              </div>
           </div>
        </div>
      </section>

      {/* Feature Section 2: Cards & Materials */}
      <section className="py-24 px-4 bg-slate-950">
         <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-16">
            <div className="flex-1 grid grid-cols-2 gap-4">
               <div className="bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl h-48 lg:h-64 shadow-2xl border border-slate-600 p-6 flex flex-col justify-between transform rotate-3 hover:rotate-6 transition-transform">
                  <div className="flex justify-between items-start">
                     <div className="text-teal-300 font-bold italic">Golden Bank</div>
                     <Wifi className="text-gray-500 h-6 w-6 rotate-90" />
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="w-10 h-7 bg-yellow-600/50 rounded flex items-center justify-center border border-yellow-500/30"></div>
                     <div className="w-6 h-6 rounded-full border border-gray-500 flex items-center justify-center"><span className="text-[8px] text-gray-400">NFC</span></div>
                  </div>
                  <div>
                     <div className="text-gray-400 text-xs font-mono mb-1">•••• 4829</div>
                     <div className="text-white text-sm font-bold">ALEXANDRE V</div>
                  </div>
               </div>
               <div className="bg-gradient-to-br from-blue-900 to-slate-900 rounded-2xl h-48 lg:h-64 shadow-2xl border border-teal-600 p-6 flex flex-col justify-between transform -rotate-3 hover:-rotate-6 transition-transform mt-8">
                  <div className="flex justify-between items-start">
                     <div className="text-white font-bold italic">Nova<span className="text-teal-300">Metal</span></div>
                     <Wifi className="text-teal-400/50 h-6 w-6 rotate-90" />
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="w-10 h-7 bg-slate-400/30 rounded flex items-center justify-center border border-slate-400/30"></div>
                  </div>
                  <div>
                     <div className="text-teal-300/50 text-xs font-mono mb-1">•••• 8888</div>
                     <div className="text-white text-sm font-bold">ALEXANDRE V</div>
                  </div>
               </div>
            </div>

            <div className="flex-1 space-y-8 text-right lg:text-left">
               <div className="inline-block px-4 py-2 bg-purple-500/10 rounded-full border border-purple-500/20 text-purple-400 text-sm font-bold uppercase tracking-wider">
                  {t('services.premiumMaterials')}
               </div>
               <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                  {t('services.cards.title')}
               </h2>
               <p className="text-lg text-gray-400">
                  {t('services.cards.description')}
               </p>
               <div className="grid grid-cols-2 gap-6 pt-4">
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                     <Layers className="h-8 w-8 text-purple-400 mb-2" />
                     <h4 className="text-white font-bold">{t('services.cards.feature1.title')}</h4>
                     <p className="text-xs text-gray-500">{t('services.cards.feature1.desc')}</p>
                  </div>
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                     <Cpu className="h-8 w-8 text-purple-400 mb-2" />
                     <h4 className="text-white font-bold">{t('services.cards.feature2.title')}</h4>
                     <p className="text-xs text-gray-500">{t('services.cards.feature2.desc')}</p>
                  </div>
               </div>
               <button onClick={() => setView('REGISTER')} className="px-8 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                  {t('services.cards.orderButton')}
               </button>
            </div>
         </div>
      </section>

      {/* Feature Section 3: Investments */}
      <section className="py-24 px-4 bg-slate-800/30 relative">
         <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-blue-900/10 to-transparent"></div>
         <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
               <div className="inline-block px-4 py-2 bg-yellow-500/10 rounded-full border border-yellow-500/20 text-yellow-400 text-sm font-bold uppercase tracking-wider">
                  {t('services.investment')}
               </div>
               <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                  {t('services.investment.title')}
               </h2>
               <p className="text-lg text-gray-400">
                  {t('services.investment.description')}
               </p>
               <ul className="space-y-4">
                  {[
                     t('services.investment.feature1'),
                     t('services.investment.feature2'),
                     t('services.investment.feature3'),
                     t('services.investment.feature4')
                  ].map((item, i) => (
                     <li key={i} className="flex items-center gap-3 text-gray-300">
                        <Check className="h-5 w-5 text-teal-400" />
                        {item}
                     </li>
                  ))}
               </ul>
            </div>
            
            <div className="flex-1">
               <div className="glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-32 bg-yellow-500/5 rounded-full blur-3xl"></div>
                  
                  <div className="flex justify-between items-end mb-8">
                     <div>
                        <div className="text-gray-400 text-sm uppercase mb-1">{t('services.investment.portfolioTotal')}</div>
                        <div className="text-4xl font-bold text-white">45 231,89 €</div>
                     </div>
                     <div className="text-teal-300 font-bold flex items-center gap-1 bg-teal-400/10 px-3 py-1 rounded-lg">
                        <TrendingUp className="h-4 w-4" /> +12.4%
                     </div>
                  </div>

                  {/* Mock Investment List */}
                  <div className="space-y-3">
                     <div className="flex items-center justify-between p-4 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors cursor-pointer border border-transparent hover:border-yellow-500/30">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 font-bold">₿</div>
                           <div>
                              <div className="text-white font-bold">Bitcoin</div>
                              <div className="text-xs text-gray-500">BTC</div>
                           </div>
                        </div>
                        <div className="text-right">
                           <div className="text-white font-bold">2 450 €</div>
                           <div className="text-xs text-teal-300">+5.2%</div>
                        </div>
                     </div>
                     
                     <div className="flex items-center justify-between p-4 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors cursor-pointer border border-transparent hover:border-teal-400/30">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-full bg-teal-400/20 flex items-center justify-center text-teal-400 font-bold">T</div>
                           <div>
                              <div className="text-white font-bold">Tesla Inc</div>
                              <div className="text-xs text-gray-500">TSLA</div>
                           </div>
                        </div>
                        <div className="text-right">
                           <div className="text-white font-bold">1 200 €</div>
                           <div className="text-xs text-teal-300">+2.1%</div>
                        </div>
                     </div>

                     <div className="flex items-center justify-between p-4 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors cursor-pointer border border-transparent hover:border-gray-500/30">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-full bg-gray-500/20 flex items-center justify-center text-gray-300 font-bold"></div>
                           <div>
                              <div className="text-white font-bold">Apple</div>
                              <div className="text-xs text-gray-500">AAPL</div>
                           </div>
                        </div>
                        <div className="text-right">
                           <div className="text-white font-bold">3 150 €</div>
                           <div className="text-xs text-red-400">-0.5%</div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Comparison Section */}
      <section className="py-24 px-4">
         <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-16">
               {t('services.comparison.title')} <span className="text-teal-300">Golden Bank</span> ?
            </h2>

            <div className="glass-panel rounded-3xl overflow-hidden border border-slate-700">
               <div className="grid grid-cols-3 bg-slate-800/50 p-6 border-b border-slate-700">
                  <div className="text-gray-400 font-bold uppercase text-xs tracking-wider pt-2">{t('services.comparison.comparison')}</div>
                  <div className="text-center text-xl font-bold text-teal-300 flex items-center justify-center gap-2">
                     <Shield className="h-6 w-6" /> Golden Bank
                  </div>
                  <div className="text-center text-xl font-bold text-gray-500">{t('services.comparison.classicBank')}</div>
               </div>

               <div className="divide-y divide-slate-800">
                  {[
                     { feature: t('services.comparison.feature1'), nova: t('services.comparison.nova1'), old: t('services.comparison.old1') },
                     { feature: t('services.comparison.feature2'), nova: t('services.comparison.nova2'), old: t('services.comparison.old2') },
                     { feature: t('services.comparison.feature3'), nova: t('services.comparison.nova3'), old: t('services.comparison.old3') },
                     { feature: t('services.comparison.feature4'), nova: t('services.comparison.nova4'), old: t('services.comparison.old4') },
                     { feature: t('services.comparison.feature5'), nova: t('services.comparison.nova5'), old: t('services.comparison.old5') },
                     { feature: t('services.comparison.feature6'), nova: t('services.comparison.nova6'), old: t('services.comparison.old6') },
                  ].map((row, i) => (
                     <div key={i} className="grid grid-cols-3 p-6 hover:bg-slate-800/30 transition-colors">
                        <div className="text-gray-300 font-medium flex items-center">{row.feature}</div>
                        <div className="text-center text-white font-bold text-lg flex justify-center items-center gap-2">
                           <Check className="h-4 w-4 text-teal-400" /> {row.nova}
                        </div>
                        <div className="text-center text-gray-500 flex justify-center items-center gap-2">
                           {row.old === "Impossible" ? <XIcon className="h-4 w-4 text-red-500" /> : null} {row.old}
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* Integrations Section */}
      <section className="py-24 px-4 bg-slate-900 border-t border-slate-800">
         <div className="max-w-7xl mx-auto text-center">
            <h3 className="text-gray-400 uppercase tracking-widest font-bold mb-12">{t('services.integrations.title')}</h3>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
               {/* Logos styled simply with text for demo purposes since we don't have SVGs */}
               <div className="flex items-center gap-2 text-3xl font-bold text-white"><span className="text-gray-400"></span> Pay</div>
               <div className="flex items-center gap-2 text-3xl font-bold text-white"><span className="text-teal-400">G</span> Pay</div>
               <div className="flex items-center gap-2 text-3xl font-bold text-white"><span className="text-teal-600">Samsung</span> Pay</div>
               <div className="flex items-center gap-2 text-3xl font-bold text-white">Garmin Pay</div>
               <div className="flex items-center gap-2 text-3xl font-bold text-white">Fitbit Pay</div>
            </div>
         </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-900/20 z-0"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
           <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">{t('services.cta.title')}</h2>
           <p className="text-xl text-gray-300 mb-12">
              {t('services.cta.description')}
           </p>
           <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => setView('REGISTER')}
                className="px-10 py-4 bg-teal-400 hover:bg-teal-500 text-white text-lg font-bold rounded-full shadow-xl shadow-teal-400/30 transition-all hover:scale-105"
              >
                {t('services.cta.openAccount')}
              </button>
              <button 
                onClick={() => setView('CONTACT')}
                className="px-10 py-4 bg-slate-800 hover:bg-slate-700 text-white text-lg font-bold rounded-full border border-slate-600 transition-all"
              >
                {t('services.cta.talkExpert')}
              </button>
           </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;