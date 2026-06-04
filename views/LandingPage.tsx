
import React, { useMemo } from 'react';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import { useBank } from '../context/BankContext';
import { 
  ShieldCheck, 
  Globe, 
  Zap, 
  CreditCard, 
  Smartphone, 
  TrendingUp, 
  Users, 
  Star,
  Check,
  ArrowRight,
  HelpCircle,
  Lock,
  Heart,
  Handshake,
  GraduationCap
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const { setView, t, language, openAppDownloadModal } = useBank();

  const testimonials = useMemo(() => [
    {
      name: "Sophie Martin",
      role: t('testimonials.role.entrepreneur'),
      content: t('testimonials.content.sophie'),
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    {
      name: "Thomas Dubois",
      role: t('testimonials.role.developer'),
      content: t('testimonials.content.thomas'),
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    {
      name: "Amélie Leroy",
      role: t('testimonials.role.nomad'),
      content: t('testimonials.content.amelie'),
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    {
      name: "Lucas Bernard",
      role: t('testimonials.role.investor'),
      content: t('testimonials.content.lucas'),
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    {
      name: "Claire Delorme",
      role: t('testimonials.role.student'),
      content: t('testimonials.content.claire'),
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    {
      name: "Marc Evrard",
      role: t('testimonials.role.restaurateur'),
      content: t('testimonials.content.marc'),
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    }
  ], [t, language]);

  const faqs = useMemo(() => [
    { q: t('faq.q1'), a: t('faq.a1') },
    { q: t('faq.q2'), a: t('faq.a2') },
    { q: t('faq.q3'), a: t('faq.a3') },
    { q: t('faq.q4'), a: t('faq.a4') },
    { q: t('faq.q5'), a: t('faq.a5') },
    { q: t('faq.q6'), a: t('faq.a6') },
    { q: t('faq.q7'), a: t('faq.a7') },
    { q: t('faq.q8'), a: t('faq.a8') }
  ], [t, language]);

  return (
    <div className="bg-slate-900 overflow-x-hidden">
      <Hero />

      {/* Stats Section */}
      <section className="relative z-10 -mt-20 px-4">
        <div className="max-w-7xl mx-auto glass-panel p-8 rounded-2xl shadow-2xl grid grid-cols-2 md:grid-cols-4 gap-8 text-center border-t border-white/10">
          <div>
            <div className="text-4xl font-bold text-teal-300 mb-1">2M+</div>
            <div className="text-gray-400 text-sm uppercase tracking-wider">{t('stats.clients')}</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-teal-300 mb-1">150+</div>
            <div className="text-gray-400 text-sm uppercase tracking-wider">{t('stats.countries')}</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-teal-300 mb-1">5Md€</div>
            <div className="text-gray-400 text-sm uppercase tracking-wider">{t('stats.transactions')}</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-teal-300 mb-1">24/7</div>
            <div className="text-gray-400 text-sm uppercase tracking-wider">{t('stats.support')}</div>
          </div>
        </div>
      </section>

      {/* Feature Highlight */}
      <section className="py-24 px-4 relative">
        <div className="absolute top-1/4 left-0 w-1/3 h-1/2 bg-teal-400/10 blur-[100px] rounded-full"></div>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">{t('features.title')}</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {t('features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel p-8 rounded-2xl hover:bg-slate-800/80 transition-all border border-slate-700 hover:border-teal-400/50 group">
              <div className="w-14 h-14 bg-teal-400/20 rounded-xl flex items-center justify-center mb-6 text-teal-300 group-hover:scale-110 transition-transform">
                <Globe className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{t('features.Borderless')}</h3>
              <p className="text-gray-400">{t('features.Borderless.desc')}</p>
            </div>
            <div className="glass-panel p-8 rounded-2xl hover:bg-slate-800/80 transition-all border border-slate-700 hover:border-teal-400/50 group">
              <div className="w-14 h-14 bg-teal-400/20 rounded-xl flex items-center justify-center mb-6 text-teal-300 group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{t('features.Security')}</h3>
              <p className="text-gray-400">{t('features.Security.desc')}</p>
            </div>
            <div className="glass-panel p-8 rounded-2xl hover:bg-slate-800/80 transition-all border border-slate-700 hover:border-teal-400/50 group">
              <div className="w-14 h-14 bg-teal-400/20 rounded-xl flex items-center justify-center mb-6 text-teal-300 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{t('features.Analytics')}</h3>
              <p className="text-gray-400">{t('features.Analytics.desc')}</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <button 
              onClick={() => setView('SERVICES')}
              className="text-teal-300 font-semibold hover:text-teal-200 flex items-center gap-2 mx-auto"
            >
              {t('features.cta')} <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 px-4 bg-slate-900 relative overflow-hidden border-t border-slate-800">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-400/5 rounded-full blur-[100px]"></div>
        <div className="max-w-7xl mx-auto relative z-10">
           <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">{t('team.title')}</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {t('team.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {useMemo(() => [
              {
                name: "Alexandre V.",
                role: t('team.member1.role'),
                image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
              },
              {
                name: "Sarah L.",
                role: t('team.member2.role'),
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
              },
              {
                name: "David M.",
                role: t('team.member3.role'),
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
              },
              {
                name: "Julie R.",
                role: t('team.member4.role'),
                image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
              }
            ], [t, language]).map((member, i) => (
               <div key={i} className="group relative">
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 group-hover:border-teal-400/50 transition-all shadow-2xl">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform">
                       <div className="text-teal-300 font-bold text-sm mb-1">{member.role}</div>
                       <div className="text-white font-bold text-xl">{member.name}</div>
                    </div>
                  </div>
                  {/* Badge Effect */}
                  <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur p-2 rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                     <ShieldCheck className="h-4 w-4 text-teal-400" />
                  </div>
               </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW SECTION: Impact & Partnerships (With Branded T-Shirts Effect) */}
      <section className="py-24 px-4 bg-slate-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
             <div className="max-w-2xl">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">{t('impact.title')}</h2>
                <p className="text-xl text-gray-400">
                  {t('impact.subtitle')}
                </p>
             </div>
             <button onClick={() => setView('ABOUT')} className="px-6 py-3 rounded-xl border border-teal-400/30 text-teal-300 hover:bg-teal-400/10 transition-colors font-bold whitespace-nowrap">
                {t('impact.cta')}
             </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             
             {/* Card 1: Strategic Partnership */}
             <div className="group rounded-3xl overflow-hidden relative h-[400px] border border-slate-800 hover:border-teal-400/50 transition-colors">
                {/* The Image */}
                <div className="absolute inset-0">
                   <img 
                      src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                      alt="Partenariat" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent"></div>
                </div>

                {/* DIGITALLY BRANDED T-SHIRT EFFECT - Man on the right */}
                {/* We overlay the Golden Bank logo on the person's chest area */}
                <div className="absolute top-[45%] right-[25%] transform -translate-y-1/2 w-20 flex flex-col items-center opacity-90 rotate-[-5deg] mix-blend-hard-light filter brightness-110">
                    <ShieldCheck className="text-teal-300 h-8 w-8 drop-shadow-md" strokeWidth={2.5} />
                    <span className="text-white font-bold text-[10px] tracking-widest drop-shadow-md mt-1 font-sans">AZUR BANK</span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8">
                   <div className="w-12 h-12 bg-teal-400/20 rounded-xl flex items-center justify-center mb-4 text-teal-300 backdrop-blur-md border border-teal-400/30">
                      <Handshake className="h-6 w-6" />
                   </div>
                   <h3 className="text-2xl font-bold text-white mb-2">{t('impact.partnerships.title')}</h3>
                   <p className="text-gray-300 text-sm">{t('impact.partnerships.desc')}</p>
                </div>
             </div>

             {/* Card 2: Charity Donation */}
             <div className="group rounded-3xl overflow-hidden relative h-[400px] border border-slate-800 hover:border-teal-400/50 transition-colors">
                <div className="absolute inset-0">
                   <img 
                      src="https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                      alt="Donation" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent"></div>
                </div>

                {/* DIGITALLY BRANDED T-SHIRT EFFECT - Woman in center */}
                <div className="absolute top-[55%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-24 flex flex-col items-center opacity-85 rotate-[2deg] mix-blend-screen">
                     <div className="bg-teal-500/80 p-1 rounded-full mb-1">
                        <ShieldCheck className="text-white h-6 w-6" />
                     </div>
                    <span className="text-teal-200 font-black text-[12px] tracking-tighter drop-shadow-lg font-sans bg-slate-900/30 px-2 rounded">NOVABANK</span>
                    <span className="text-white text-[8px] uppercase tracking-widest">Foundation</span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8">
                   <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center mb-4 text-pink-400 backdrop-blur-md border border-pink-500/30">
                      <Heart className="h-6 w-6" />
                   </div>
                   <h3 className="text-2xl font-bold text-white mb-2">{t('impact.charity.title')}</h3>
                   <p className="text-gray-300 text-sm">{t('impact.charity.desc')}</p>
                </div>
             </div>

             {/* Card 3: Education */}
             <div className="group rounded-3xl overflow-hidden relative h-[400px] border border-slate-800 hover:border-teal-400/50 transition-colors">
                <div className="absolute inset-0">
                   <img 
                      src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                      alt="Education" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent"></div>
                </div>

                {/* DIGITALLY BRANDED T-SHIRT EFFECT - Person presenting */}
                <div className="absolute top-[48%] left-[45%] transform -translate-x-1/2 -translate-y-1/2 w-16 flex flex-col items-center opacity-80 mix-blend-color-dodge">
                    <ShieldCheck className="text-white h-10 w-10 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]" />
                    <span className="text-white font-bold text-[8px] tracking-widest mt-1">STAFF</span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8">
                   <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mb-4 text-yellow-400 backdrop-blur-md border border-yellow-500/30">
                      <GraduationCap className="h-6 w-6" />
                   </div>
                   <h3 className="text-2xl font-bold text-white mb-2">{t('impact.education.title')}</h3>
                   <p className="text-gray-300 text-sm">{t('impact.education.desc')}</p>
                </div>
             </div>

          </div>
        </div>
      </section>

      {/* App Showcase Section */}
      <section className="py-24 px-4 bg-slate-800/30 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <h2 className="text-4xl font-bold text-white leading-tight">
              {t('app.title')} <br/>
              <span className="text-teal-300">{t('app.title.highlight')}</span>
            </h2>
            <p className="text-lg text-gray-400">
              {t('app.desc')}
            </p>
            <ul className="space-y-4">
              {[t('app.feature1'), t('app.feature2'), t('app.feature3'), t('app.feature4')].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-300">
                  <div className="w-6 h-6 rounded-full bg-teal-400/20 flex items-center justify-center">
                    <Check className="h-3 w-3 text-teal-300" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <button 
              onClick={() => openAppDownloadModal()}
              className="bg-white text-slate-900 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all flex items-center gap-2"
            >
              <Smartphone className="h-5 w-5" />
              {t('app.download')}
            </button>
          </div>
          <div className="flex-1 relative">
             <div className="absolute inset-0 bg-teal-400/20 blur-[80px] rounded-full"></div>
             <div className="relative z-10 bg-slate-900 border-8 border-slate-800 rounded-[3rem] shadow-2xl p-2 max-w-xs mx-auto rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="bg-slate-800 rounded-[2.5rem] overflow-hidden h-[500px] w-full relative">
                  {/* Mock Phone UI */}
                  <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-slate-900/80 to-transparent p-6 z-20">
                    <div className="flex justify-between text-white">
                      <span>9:41</span>
                      <div className="flex gap-1">
                        <div className="w-4 h-4 rounded-full bg-white"></div>
                        <div className="w-4 h-4 rounded-full bg-white/50"></div>
                      </div>
                    </div>
                  </div>
                  <img src="https://images.unsplash.com/photo-1616077168079-7e09a677fb2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover opacity-80" alt="App UI" />
                  <div className="absolute bottom-6 left-6 right-6 glass-panel p-4 rounded-xl border-white/20">
                     <div className="text-xs text-gray-400 mb-1">{t('dashboard.totalBalance')}</div>
                     <div className="text-2xl font-bold text-white">12,450.00 €</div>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">{t('pricing.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 text-left">
            <div className="glass-panel p-8 rounded-2xl border-t-4 border-gray-500">
              <h3 className="text-xl font-bold text-white">{t('pricing.std')}</h3>
              <div className="text-3xl font-bold text-teal-300 my-4">0 €<span className="text-sm text-gray-500 font-normal">{t('common.month')}</span></div>
              <ul className="space-y-3 mb-8 text-gray-400 text-sm">
                <li>✓ {t('pricing.std.feature1')}</li>
                <li>✓ {t('pricing.std.feature2')}</li>
                <li>✓ {t('pricing.std.feature3')}</li>
              </ul>
              <button onClick={() => setView('REGISTER')} className="w-full py-3 bg-slate-700 text-white rounded-lg font-bold hover:bg-slate-600">{t('pricing.choose')}</button>
            </div>
            <div className="glass-panel p-8 rounded-2xl border-t-4 border-teal-400 transform scale-105 shadow-xl shadow-teal-400/10 z-10 bg-slate-800">
              <h3 className="text-xl font-bold text-white">{t('pricing.prem')}</h3>
              <div className="text-3xl font-bold text-teal-300 my-4">9.99 €<span className="text-sm text-gray-500 font-normal">{t('common.month')}</span></div>
              <ul className="space-y-3 mb-8 text-gray-400 text-sm">
                <li className="text-white">✓ {t('pricing.prem.feature1')}</li>
                <li className="text-white">✓ {t('pricing.prem.feature2')}</li>
                <li className="text-white">✓ {t('pricing.prem.feature3')}</li>
              </ul>
              <button onClick={() => setView('REGISTER')} className="w-full py-3 bg-teal-400 text-white rounded-lg font-bold hover:bg-teal-500">{t('pricing.choose')}</button>
            </div>
            <div className="glass-panel p-8 rounded-2xl border-t-4 border-yellow-500">
              <h3 className="text-xl font-bold text-white">{t('pricing.elite')}</h3>
              <div className="text-3xl font-bold text-teal-300 my-4">16.99 €<span className="text-sm text-gray-500 font-normal">{t('common.month')}</span></div>
              <ul className="space-y-3 mb-8 text-gray-400 text-sm">
                <li>✓ {t('pricing.elite.feature1')}</li>
                <li>✓ {t('pricing.elite.feature2')}</li>
                <li>✓ {t('pricing.elite.feature3')}</li>
              </ul>
              <button onClick={() => setView('REGISTER')} className="w-full py-3 bg-slate-700 text-white rounded-lg font-bold hover:bg-slate-600">{t('pricing.choose')}</button>
            </div>
          </div>
          <button onClick={() => setView('PRICING')} className="mt-12 text-gray-400 hover:text-white underline">{t('pricing.compare')}</button>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4 text-yellow-500">
            <Star className="fill-current h-6 w-6" />
            <Star className="fill-current h-6 w-6" />
            <Star className="fill-current h-6 w-6" />
            <Star className="fill-current h-6 w-6" />
            <Star className="fill-current h-6 w-6" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-16 text-center">{t('testimonials.title')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="glass-panel p-8 rounded-2xl relative">
                <div className="absolute -top-6 left-8">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full border-2 border-teal-400 shadow-lg" />
                </div>
                <p className="text-gray-300 italic mb-6 mt-4">"{testimonial.content}"</p>
                <div>
                  <div className="text-white font-bold">{testimonial.name}</div>
                  <div className="text-teal-300 text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 bg-teal-400/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <Lock className="h-10 w-10 text-teal-300" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-6">{t('security.title')}</h2>
          <p className="text-gray-400 text-lg mb-8">
            {t('security.desc')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="px-4 py-2 bg-slate-800 rounded-full text-gray-300 text-sm border border-slate-700">{t('security.badge1')}</span>
            <span className="px-4 py-2 bg-slate-800 rounded-full text-gray-300 text-sm border border-slate-700">{t('security.badge2')}</span>
            <span className="px-4 py-2 bg-slate-800 rounded-full text-gray-300 text-sm border border-slate-700">{t('security.badge3')}</span>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 bg-slate-800/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center flex items-center justify-center gap-3">
            <HelpCircle className="h-8 w-8 text-teal-300" />
            {t('faq.title')}
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="glass-panel p-6 rounded-xl hover:bg-slate-800 transition-colors">
                <h3 className="text-white font-bold text-lg mb-2">{faq.q}</h3>
                <p className="text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-slate-900/40 z-0"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10 glass-panel p-12 rounded-3xl border border-teal-400/30 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">{t('cta.title')}</h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            {t('cta.desc')}
          </p>
          <button 
            onClick={() => setView('REGISTER')}
            className="bg-teal-400 hover:bg-teal-500 text-white px-10 py-5 rounded-full text-xl font-bold transition-all shadow-xl shadow-teal-400/30 hover:scale-105"
          >
            {t('cta.button')}
          </button>
          <p className="mt-6 text-gray-500 text-sm">{t('cta.disclaimer')}</p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
