import React, { useMemo } from 'react';
import Footer from '../components/Footer';
import { CheckCircle, ShieldCheck, Handshake, Heart, GraduationCap } from 'lucide-react';
import { useBank } from '../context/BankContext';

const About: React.FC = () => {
  const { t, language } = useBank();
  return (
    <div className="bg-slate-900 min-h-screen pt-20">
      <section className="py-12 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-teal-400/5 blur-[120px] rounded-full"></div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="relative animate-fade-in-up">
            <div className="absolute -inset-4 bg-teal-400/20 rounded-2xl blur-lg"></div>
            <img 
              src="https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
              alt="Futuristic Office" 
              className="relative rounded-2xl shadow-2xl border border-slate-700 w-full object-cover h-[500px]"
            />
            <div className="absolute -bottom-6 -right-6 glass-panel p-6 rounded-xl border border-teal-400/30 backdrop-blur-md bg-slate-900/80">
               <div className="text-4xl font-bold text-teal-300">10M+</div>
               <div className="text-sm text-gray-300">{t('about.activeUsers')}</div>
            </div>
          </div>
          
          <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              {t('about.title')} <span className="text-teal-300">{t('about.titleHighlight')}</span>
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed">
              {t('about.description')}
            </p>
            
            <div className="space-y-4">
              {[
                t('about.feature1'),
                t('about.feature2'),
                t('about.feature3'),
                t('about.feature4')
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-teal-400" />
                  <span className="text-white font-medium">{item}</span>
                </div>
              ))}
            </div>
            
            <div className="pt-4 flex gap-8 border-t border-slate-800">
              <div>
                <div className="text-3xl font-bold text-white mb-1">99.9%</div>
                <div className="text-sm text-gray-500 uppercase tracking-wider">{t('about.statUptime')}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">0s</div>
                <div className="text-sm text-gray-500 uppercase tracking-wider">{t('about.statLatency')}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">24h</div>
                <div className="text-sm text-gray-500 uppercase tracking-wider">{t('about.statSupport')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-slate-800/50">
        <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl font-bold text-white">{t('about.vision.title')}</h2>
            <p className="text-gray-300 text-lg leading-loose">
                {t('about.vision.description')}
            </p>
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

      {/* Impact Section */}
      <section className="py-24 px-4 bg-slate-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
             <div className="max-w-2xl">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">{t('impact.title')}</h2>
                <p className="text-xl text-gray-400">
                  {t('impact.subtitle')}
                </p>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             
             {/* Card 1 */}
             <div className="group rounded-3xl overflow-hidden relative h-[400px] border border-slate-800 hover:border-teal-400/50 transition-colors">
                <div className="absolute inset-0">
                   <img 
                      src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                      alt="Partenariat" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent"></div>
                </div>

                <div className="absolute top-[45%] right-[25%] transform -translate-y-1/2 w-20 flex flex-col items-center opacity-90 rotate-[-5deg] mix-blend-hard-light filter brightness-110">
                    <ShieldCheck className="text-teal-300 h-8 w-8 drop-shadow-md" strokeWidth={2.5} />
                    <span className="text-white font-bold text-[10px] tracking-widest drop-shadow-md mt-1 font-sans">NOVABANK</span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8">
                   <div className="w-12 h-12 bg-teal-400/20 rounded-xl flex items-center justify-center mb-4 text-teal-300 backdrop-blur-md border border-teal-400/30">
                      <Handshake className="h-6 w-6" />
                   </div>
                   <h3 className="text-2xl font-bold text-white mb-2">{t('impact.partnerships.title')}</h3>
                   <p className="text-gray-300 text-sm">{t('impact.partnerships.desc')}</p>
                </div>
             </div>

             {/* Card 2 */}
             <div className="group rounded-3xl overflow-hidden relative h-[400px] border border-slate-800 hover:border-teal-400/50 transition-colors">
                <div className="absolute inset-0">
                   <img 
                      src="https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                      alt="Donation" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent"></div>
                </div>

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

             {/* Card 3 */}
             <div className="group rounded-3xl overflow-hidden relative h-[400px] border border-slate-800 hover:border-teal-400/50 transition-colors">
                <div className="absolute inset-0">
                   <img 
                      src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                      alt="Education" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent"></div>
                </div>

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

      <Footer />
    </div>
  );
};

export default About;