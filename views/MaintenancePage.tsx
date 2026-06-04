import React from 'react';
import { Settings, Shield, Clock } from 'lucide-react';

const MaintenancePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center text-slate-100 font-sans selection:bg-teal-400 selection:text-white relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-400/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-400/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-2xl w-full">
        {/* Logo Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-teal-400 blur-xl opacity-20 rounded-full animate-pulse"></div>
            <div className="h-24 w-24 bg-slate-800 rounded-2xl border border-slate-700 flex items-center justify-center shadow-xl relative z-10">
              <Settings className="w-12 h-12 text-teal-300 animate-[spin_4s_linear_infinite]" />
            </div>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-teal-300 to-teal-400 bg-clip-text text-transparent">
          Site em manutenção temporária
        </h1>
        
        <p className="text-xl text-slate-400 mb-10 leading-relaxed max-w-xl mx-auto">
          No momento, estamos realizando melhorias importantes no Golden Bank para oferecer a você uma experiência ainda mais segura e eficiente.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 p-6 rounded-2xl flex flex-col items-center text-center">
            <div className="h-12 w-12 bg-teal-400/20 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-teal-300" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Retorno em breve</h3>
            <p className="text-sm text-slate-400">O serviço será restabelecido o mais rápido possível.</p>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 p-6 rounded-2xl flex flex-col items-center text-center">
            <div className="h-12 w-12 bg-teal-400/20 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-teal-300" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Segurança reforçada</h3>
            <p className="text-sm text-slate-400">Seus dados e fundos permanecem totalmente seguros.</p>
          </div>
        </div>

        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-slate-800/80 border border-slate-700/50 text-sm text-slate-300">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-400"></span>
          </span>
          Equipe técnica trabalhando
        </div>
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-6 left-0 w-full text-center text-slate-500 text-sm z-10">
        <p>&copy; {new Date().getFullYear()} Golden Bank. Todos os direitos reservados.</p>
      </div>
    </div>
  );
};

export default MaintenancePage;
