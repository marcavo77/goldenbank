
import React, { useState, useRef, useEffect } from 'react';
import { useBank } from '../context/BankContext';
import { LANGUAGES } from '../translations';
import { Check } from 'lucide-react';
import { LanguageCode } from '../translations';

// Mapping pour FlagCDN (conversion code langue -> code pays)
const FLAG_CODES: Record<string, string> = {
  fr: 'fr',
  en: 'us',
  es: 'es',
  de: 'de',
  it: 'it',
  pt: 'pt',
  nl: 'nl',
  ru: 'ru',
  zh: 'cn',
  ja: 'jp',
  ar: 'sa'
};

const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useBank();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
        title={t('common.changeLanguage')}
      >
        <img 
            src={`https://flagcdn.com/w40/${FLAG_CODES[currentLang.code] || 'fr'}.png`} 
            alt={currentLang.name} 
            className="w-6 h-4 object-cover rounded-sm shadow-sm" 
        />
        <span className="font-bold uppercase text-sm">{currentLang.code}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 glass-panel border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in-up">
            <div className="max-h-80 overflow-y-auto custom-scrollbar p-2 space-y-1">
                {LANGUAGES.map((lang) => (
                    <button
                        key={lang.code}
                        onClick={() => {
                            setLanguage(lang.code as LanguageCode);
                            setIsOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-sm ${
                            language === lang.code 
                            ? 'bg-teal-400/20 text-teal-300' 
                            : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                             <img 
                                src={`https://flagcdn.com/w40/${FLAG_CODES[lang.code] || 'fr'}.png`} 
                                alt={lang.name} 
                                className="w-5 h-3.5 object-cover rounded-sm shadow-sm" 
                            />
                            <span>{lang.name}</span>
                        </div>
                        {language === lang.code && <Check className="h-4 w-4" />}
                    </button>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
