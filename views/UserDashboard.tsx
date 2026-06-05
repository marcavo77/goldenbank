
import React, { useState, useEffect, useRef } from 'react';
import { useBank } from '../context/BankContext';
import { 
  CreditCard as CardIcon, 
  LogOut, 
  Settings, 
  History, 
  Send, 
  AlertTriangle, 
  Lock, 
  CheckCircle, 
  X, 
  Minimize2, 
  ArrowDownLeft, 
  ArrowUpRight, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Globe,
  Landmark,
  ShieldCheck,
  Building2,
  PiggyBank,
  Wallet,
  Target,
  User as UserIcon,
  Camera,
  Save,
  Mail,
  Phone,
  MapPin,
  Key,
  Eye,
  EyeOff,
  Calendar,
  Trophy,
  FileText,
  Loader2
} from 'lucide-react';
import { CURRENCY, COUNTRIES } from '../constants';

const StockMarketWidget: React.FC = () => {
  // Use market state from Context for persistence
  const { marketState, t, language } = useBank();
  const { novaPrice, novaHistory, failingBank, competitorPrice, competitorHistory, marketData } = marketState;

  // Memoize translations to ensure re-render when language changes
  const translations = React.useMemo(() => ({
    markets: t('dashboard.markets'),
    live: t('dashboard.live'),
    volume: t('dashboard.volume'),
    strongBuy: t('dashboard.strongBuy'),
    trend: t('dashboard.trend'),
    massiveSell: t('dashboard.massiveSell'),
    bank: t('dashboard.bank'),
    price: t('dashboard.price'),
  }), [t, language]);

  // Generate SVG Path for the Graph
  const getGraphPath = (data: number[], width: number, height: number) => {
    if (data.length === 0) return "";
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    // Points coordinates
    const points = data.map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * height; // Invert Y because SVG 0 is top
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  };

  // Generate Area Path (closing the loop at the bottom)
  const getAreaPath = (data: number[], width: number, height: number) => {
    const linePath = getGraphPath(data, width, height);
    return `${linePath} L ${width},${height} L 0,${height} Z`;
  };

  const novaChange = novaPrice - 1245.50; // Reference price start of session
  const isNovaUp = novaChange >= 0;

  const competitorChange = competitorPrice - failingBank.price;
  const isCompetitorUp = competitorChange >= 0;

  return (
    <div className="glass-panel rounded-2xl p-4 md:p-6 relative overflow-hidden">
      <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
        <Globe className="text-teal-300 h-5 w-5" />
        <h2 className="text-lg md:text-xl font-bold text-white">{translations.markets} <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded animate-pulse ml-2">{translations.live}</span></h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Charts Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Chart 1: Golden Bank (Rising) */}
            <div className="flex flex-col justify-between h-[200px] md:h-[250px] relative bg-slate-800/50 rounded-xl border border-slate-700 p-4 md:p-6 overflow-hidden">
            {/* Header Info */}
            <div className="flex justify-between items-start z-10">
                <div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-teal-400 rounded flex items-center justify-center font-bold text-slate-900 text-xs md:text-base shadow-lg shadow-teal-400/20">G</div>
                    <h3 className="text-lg md:text-2xl font-bold text-white">Golden Bank Corp.</h3>
                    <span className="text-gray-400 font-mono text-xs md:text-sm">($NVB)</span>
                </div>
                <div className="mt-2 flex items-baseline gap-2 md:gap-4">
                    <span className="text-xl md:text-3xl font-mono font-bold text-white">{novaPrice.toFixed(2)} €</span>
                    <span className={`flex items-center text-xs md:text-sm font-bold ${isNovaUp ? 'text-teal-300' : 'text-red-400'}`}>
                        {isNovaUp ? <TrendingUp className="h-3 w-3 md:h-4 md:w-4 mr-1"/> : <TrendingDown className="h-3 w-3 md:h-4 md:w-4 mr-1"/>}
                        {Math.abs(novaChange).toFixed(2)} ({((novaChange / 1245.50) * 100).toFixed(2)}%)
                    </span>
                </div>
                </div>
                <div className="text-right hidden sm:block">
                  <div className="text-xs text-gray-400 uppercase tracking-widest">{translations.volume}</div>
                  <div className="text-teal-300 font-mono font-bold">{translations.strongBuy}</div>
                </div>
            </div>

            {/* The Graph */}
            <div className="absolute inset-0 pt-20 px-0 pb-0 opacity-80">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 500 200">
                <defs>
                    <linearGradient id="chartGradientNova" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22e6e8" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#22e6e8" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path d={getAreaPath(novaHistory, 500, 200)} fill="url(#chartGradientNova)" />
                <path d={getGraphPath(novaHistory, 500, 200)} fill="none" stroke="#22e6e8" strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" className="drop-shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                </svg>
            </div>
            </div>

            {/* Chart 2: Failing Competitor (Falling) */}
            <div className="flex flex-col justify-between h-[200px] md:h-[250px] relative bg-slate-800/50 rounded-xl border border-slate-700 p-4 md:p-6 overflow-hidden">
                {/* Header Info */}
                <div className="flex justify-between items-start z-10">
                    <div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-slate-700 rounded flex items-center justify-center font-bold text-gray-400 text-xs md:text-base shadow-inner">{failingBank.letter}</div>
                        <h3 className="text-lg md:text-xl font-bold text-gray-300">{failingBank.name}</h3>
                        <span className="text-gray-500 font-mono text-xs md:text-sm">(${failingBank.symbol})</span>
                    </div>
                    <div className="mt-2 flex items-baseline gap-2 md:gap-4">
                        <span className="text-xl md:text-3xl font-mono font-bold text-gray-300">{competitorPrice.toFixed(2)} €</span>
                        <span className={`flex items-center text-xs md:text-sm font-bold ${isCompetitorUp ? 'text-teal-300' : 'text-red-500'}`}>
                            {isCompetitorUp ? <TrendingUp className="h-3 w-3 md:h-4 md:w-4 mr-1"/> : <TrendingDown className="h-3 w-3 md:h-4 md:w-4 mr-1"/>}
                            {Math.abs(competitorChange).toFixed(2)} ({((competitorChange / failingBank.price) * 100).toFixed(2)}%)
                        </span>
                    </div>
                    </div>
                    <div className="text-right hidden sm:block">
                       <div className="text-xs text-gray-400 uppercase tracking-widest">{translations.trend}</div>
                       <div className="text-red-500 font-mono font-bold animate-pulse">{translations.massiveSell}</div>
                    </div>
                </div>

                {/* The Graph */}
                <div className="absolute inset-0 pt-20 px-0 pb-0 opacity-60">
                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 500 200">
                    <defs>
                        <linearGradient id="chartGradientDino" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <path d={getAreaPath(competitorHistory, 500, 200)} fill="url(#chartGradientDino)" />
                    <path d={getGraphPath(competitorHistory, 500, 200)} fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" className="drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                    </svg>
                </div>
            </div>

        </div>

        {/* Competitor List */}
        <div className="lg:col-span-1 bg-slate-900/50 rounded-xl border border-slate-700 overflow-hidden flex flex-col h-[400px] lg:h-[524px]">
          <div className="p-3 bg-slate-800 border-b border-slate-700 text-xs font-bold text-gray-400 uppercase tracking-wider flex justify-between">
            <span>{translations.bank}</span>
            <span>{translations.price}</span>
          </div>
          <div className="overflow-y-auto flex-1 custom-scrollbar relative">
             <div className="absolute inset-0 space-y-1 p-2">
                {[...marketData].sort((a,b) => b.price - a.price).map((stock) => (
                  <div key={stock.symbol} className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg transition-colors group border border-transparent hover:border-white/5">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-white p-0.5 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                          <img 
                            src={`https://logo.clearbit.com/${stock.domain}`} 
                            alt={stock.name}
                            className="w-full h-full object-contain"
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/32?text=' + stock.symbol[0]; }}
                          />
                       </div>
                       <div className="min-w-0">
                          <div className="text-white font-bold text-sm leading-tight truncate">{stock.symbol}</div>
                          <div className="text-gray-500 text-[10px] uppercase truncate w-20">{stock.name}</div>
                       </div>
                    </div>
                    <div className="text-right whitespace-nowrap pl-2">
                       <div className="text-white font-mono text-sm">{stock.price.toFixed(2)}</div>
                       <div className={`text-[10px] font-bold ${stock.trend === 'up' ? 'text-teal-400' : 'text-red-500'}`}>
                          {stock.trend === 'up' ? '+' : ''}{stock.change.toFixed(2)}%
                       </div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// --- SAVINGS GLOBAL RANKING WIDGET ---
// This widget is specifically designed to keep Golden Bank floating between rank 15 and 20.
// It uses fixed price tiers to ensure the order is maintained roughly while allowing local shuffling.
const SavingsGlobalRankingWidget: React.FC = () => {
    const { t, language } = useBank();

    // Memoize translations to ensure re-render when language changes
    const translations = React.useMemo(() => ({
        globalRanking: t('dashboard.globalRanking'),
        top30: t('dashboard.top30'),
        yourBank: t('dashboard.yourBank'),
        currentRank: t('dashboard.currentRank'),
    }), [t, language]);
    
    interface RankingCompany {
        name: string;
        symbol: string;
        price: number;
        change: number;
        isHero?: boolean;
        logoDomain: string;
    }

    const [companies, setCompanies] = useState<RankingCompany[]>([
        // --- TIER 1: THE UNTOUCHABLES (Rank 1-14) ---
        // High prices > 400. Golden Bank can't reach these easily.
        { name: "Apple Inc.", symbol: "AAPL", price: 950.20, change: 0, logoDomain: "apple.com" },
        { name: "Microsoft", symbol: "MSFT", price: 920.50, change: 0, logoDomain: "microsoft.com" },
        { name: "Saudi Aramco", symbol: "2222.SR", price: 890.00, change: 0, logoDomain: "aramco.com" },
        { name: "Alphabet (Google)", symbol: "GOOGL", price: 850.10, change: 0, logoDomain: "abc.xyz" },
        { name: "Amazon", symbol: "AMZN", price: 810.30, change: 0, logoDomain: "amazon.com" },
        { name: "NVIDIA", symbol: "NVDA", price: 780.45, change: 0, logoDomain: "nvidia.com" },
        { name: "Tesla", symbol: "TSLA", price: 720.00, change: 0, logoDomain: "tesla.com" },
        { name: "Meta Platforms", symbol: "META", price: 690.80, change: 0, logoDomain: "meta.com" },
        { name: "Berkshire Hathaway", symbol: "BRK.B", price: 650.00, change: 0, logoDomain: "berkshirehathaway.com" },
        { name: "TSMC", symbol: "TSM", price: 600.20, change: 0, logoDomain: "tsmc.com" },
        { name: "Tencent", symbol: "TCEHY", price: 550.50, change: 0, logoDomain: "tencent.com" },
        { name: "Visa", symbol: "V", price: 500.80, change: 0, logoDomain: "visa.com" },
        { name: "UnitedHealth", symbol: "UNH", price: 480.20, change: 0, logoDomain: "unitedhealthgroup.com" },
        { name: "Johnson & Johnson", symbol: "JNJ", price: 450.10, change: 0, logoDomain: "jnj.com" },

        // --- TIER 2: THE BATTLEGROUND (Rank 15-20) ---
        // Mid prices ~300. This is where Golden Bank lives.
        { name: "JPMorgan Chase", symbol: "JPM", price: 320.50, change: 0, logoDomain: "jpmorganchase.com" },
        { name: "Samsung", symbol: "005930.KS", price: 315.20, change: 0, logoDomain: "samsung.com" },
        { name: "LVMH", symbol: "MC.PA", price: 310.80, change: 0, logoDomain: "lvmh.com" },
        { name: "Golden Bank Corp.", symbol: "NVB", price: 300.00, change: 0, isHero: true, logoDomain: "goldenbank.company" }, // HERO
        { name: "Walmart", symbol: "WMT", price: 295.40, change: 0, logoDomain: "walmart.com" },
        { name: "Procter & Gamble", symbol: "PG", price: 290.10, change: 0, logoDomain: "pg.com" },

        // --- TIER 3: THE FOLLOWERS (Rank 21+) ---
        // Low prices < 200. Golden Bank shouldn't fall here.
        { name: "Mastercard", symbol: "MA", price: 190.50, change: 0, logoDomain: "mastercard.com" },
        { name: "ExxonMobil", symbol: "XOM", price: 180.20, change: 0, logoDomain: "exxonmobil.com" },
        { name: "Nestlé", symbol: "NESN", price: 170.80, change: 0, logoDomain: "nestle.com" },
        { name: "Chevron", symbol: "CVX", price: 160.40, change: 0, logoDomain: "chevron.com" },
        { name: "Roche", symbol: "ROG", price: 150.10, change: 0, logoDomain: "roche.com" },
        { name: "Coca-Cola", symbol: "KO", price: 140.50, change: 0, logoDomain: "coca-cola.com" },
        { name: "PepsiCo", symbol: "PEP", price: 130.20, change: 0, logoDomain: "pepsico.com" },
        { name: "Costco", symbol: "COST", price: 120.90, change: 0, logoDomain: "costco.com" },
        { name: "Toyota", symbol: "TM", price: 110.60, change: 0, logoDomain: "toyota.com" },
        { name: "Merck", symbol: "MRK", price: 100.30, change: 0, logoDomain: "merck.com" }
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCompanies(prev => {
                return prev.map(company => {
                    // Volatility factor depends on tier to ensure they stay roughly in their lanes
                    // but move enough to shuffle locally.
                    const isHero = company.isHero;
                    let fluctuation = 0;

                    if (company.price > 400) {
                        // Top tier: fluctuate but stay high
                        fluctuation = (Math.random() - 0.5) * 2; 
                    } else if (company.price < 200) {
                        // Bottom tier: fluctuate but stay low
                        fluctuation = (Math.random() - 0.5) * 2;
                    } else {
                        // Middle tier (Golden Bank zone): Higher volatility to encourage shuffling
                        fluctuation = (Math.random() - 0.5) * 4; 
                    }

                    // Calculate new price
                    let newPrice = company.price + fluctuation;

                    // "Rubber Band" logic specifically for Golden Bank to keep it strictly in the mix
                    // but not letting it drift too far up or down out of the 300 range.
                    if (isHero) {
                        if (newPrice > 330) newPrice -= 1; // Push down if too high
                        if (newPrice < 280) newPrice += 1; // Push up if too low
                    }

                    return {
                        ...company,
                        price: newPrice,
                        change: fluctuation
                    };
                }).sort((a, b) => b.price - a.price); // Always sort by price to determine rank
            });
        }, 1500); // Update every 1.5s

        return () => clearInterval(interval);
    }, []);

    // Find Golden Bank's current rank
    const novaRank = companies.findIndex(c => c.isHero) + 1;

    return (
        <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/5 relative overflow-hidden flex flex-col h-[500px] md:h-[600px]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex justify-between items-center mb-6 relative z-10">
                <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                    <Trophy className="h-5 w-5 md:h-6 md:w-6 text-yellow-500" /> {translations.globalRanking}
                </h3>
                <div className="bg-slate-800 px-3 py-1 rounded-full border border-slate-700 text-xs text-gray-400 font-mono">
                    {translations.top30}
                </div>
            </div>

            {/* Golden Bank Live Rank Indicator */}
            <div className="mb-4 bg-blue-900/20 border border-teal-400/30 p-3 rounded-xl flex items-center justify-between">
                 <span className="text-teal-300 font-bold text-sm">{translations.yourBank}</span>
                 <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-xs">{translations.currentRank}</span>
                    <span className="text-2xl font-bold text-white">#{novaRank}</span>
                 </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 relative z-10">
                <div className="space-y-2">
                    {companies.map((company, index) => {
                        const rank = index + 1;
                        const isNova = company.isHero;
                        return (
                            <div 
                                key={company.symbol}
                                className={`flex items-center justify-between p-2 md:p-3 rounded-xl transition-all duration-500 ${
                                    isNova 
                                    ? 'bg-teal-400/20 border border-teal-400/50 shadow-[0_0_15px_rgba(37,99,235,0.2)] transform scale-[1.02]' 
                                    : 'bg-slate-800/30 border border-transparent hover:bg-slate-700/50'
                                }`}
                            >
                                <div className="flex items-center gap-2 md:gap-4">
                                    <div className={`w-6 h-6 md:w-8 md:h-8 flex items-center justify-center font-bold rounded-lg text-xs md:text-base ${
                                        rank <= 3 ? 'text-yellow-400 bg-yellow-400/10' : 
                                        isNova ? 'text-teal-300 bg-teal-300/10' : 'text-gray-500 bg-slate-800'
                                    }`}>
                                        {rank}
                                    </div>
                                    
                                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white p-0.5 shrink-0 overflow-hidden">
                                        {isNova ? (
                                            <div className="w-full h-full bg-teal-400 flex items-center justify-center text-white font-bold text-[10px]">G</div>
                                        ) : (
                                            <img 
                                                src={`https://logo.clearbit.com/${company.logoDomain}`} 
                                                alt={company.name}
                                                className="w-full h-full object-contain"
                                                onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/32?text=' + company.symbol[0]; }}
                                            />
                                        )}
                                    </div>

                                    <div>
                                        <div className={`font-bold text-xs md:text-sm ${isNova ? 'text-white' : 'text-gray-300'}`}>
                                            {company.name}
                                        </div>
                                        <div className="text-[10px] text-gray-500 font-mono">
                                            {company.symbol}
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className={`font-mono font-bold text-xs md:text-sm ${isNova ? 'text-teal-300' : 'text-white'}`}>
                                        {company.price.toFixed(2)} $
                                    </div>
                                    <div className={`text-[10px] font-bold flex items-center justify-end ${company.change >= 0 ? 'text-teal-400' : 'text-red-500'}`}>
                                        {company.change >= 0 ? <TrendingUp className="h-3 w-3 mr-1"/> : <TrendingDown className="h-3 w-3 mr-1"/>}
                                        {Math.abs(company.change).toFixed(2)}%
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};


const CreditCardDisplay: React.FC = () => {
  const { currentUser, t, language } = useBank();
  if (!currentUser) return null;

  // Direct translation calls - React will re-render when language changes via context
  const cardholderText = t('dashboard.cardholder');
  const expireText = t('dashboard.expire');

  // Use language in JSX to force re-render when it changes
  return (
    <div className="credit-card-gradient w-full max-w-sm h-56 rounded-2xl p-6 relative shadow-2xl text-white overflow-hidden transform transition-transform hover:scale-105 duration-300 flex flex-col justify-between mx-auto lg:mx-0" data-lang={language}>
      {/* Background Effect */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
      
      {/* Header */}
      <div className="flex justify-between items-start relative z-10">
        <div className="text-2xl font-bold italic tracking-wider">Golden Bank</div>
        <CardIcon className="h-8 w-8 opacity-80" />
      </div>
      
      {/* Middle Content: Chip & Number */}
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex items-center gap-3">
            <div className="w-12 h-8 bg-yellow-400/80 rounded-md flex items-center justify-center shadow-sm border border-yellow-500/50">
                <div className="w-8 h-5 border border-black/20 rounded-sm grid grid-cols-2 gap-px">
                    <div className="border-r border-black/10"></div>
                    <div></div>
                </div>
            </div>
            <div className="text-xs opacity-70 font-medium tracking-widest">NFC</div>
        </div>
        
        <div className="font-mono text-lg sm:text-2xl tracking-[0.15em] drop-shadow-md whitespace-nowrap overflow-hidden text-ellipsis">
          {currentUser.cardNumber}
        </div>
      </div>
      
      {/* Footer */}
      <div className="relative z-10 flex justify-between items-end">
        <div>
          <div className="text-[10px] opacity-70 uppercase tracking-wider mb-0.5">{cardholderText}</div>
          <div className="font-medium uppercase text-sm tracking-wide truncate max-w-[150px]">{currentUser.name}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] opacity-70 uppercase tracking-wider mb-0.5">{expireText}</div>
          <div className="font-medium text-sm tracking-wide font-mono">{currentUser.cardExpiry}</div>
        </div>
      </div>
    </div>
  );
};

// --- SETTINGS MODAL COMPONENT ---
const SettingsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { currentUser, updateUserProfile, t, language } = useBank();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
    avatarUrl: currentUser?.avatarUrl || '',
    birthDate: currentUser?.birthDate || '',
    country: currentUser?.country || COUNTRIES[0],
    newPassword: '',
    currentPassword: ''
  });
  
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // Update formData when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        address: currentUser.address || '',
        avatarUrl: currentUser.avatarUrl || '',
        birthDate: currentUser.birthDate || '',
        country: currentUser.country || COUNTRIES[0],
        newPassword: '',
        currentPassword: ''
      });
    }
  }, [currentUser]);

  if (!currentUser) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);
    
    try {
      // Handle password update - verify current password first
      if (formData.newPassword) {
        if (formData.newPassword.length < 6) {
          setError(t('dashboard.passwordError.length'));
          setIsSaving(false);
          return;
        }

        // Verify current password is provided
        if (!formData.currentPassword) {
          setError(t('dashboard.passwordError.required'));
          setIsSaving(false);
          return;
        }

        // Verify current password by attempting to sign in
        // Note: This will refresh the session, which is fine
        const { authService } = await import('../services/supabaseService');
        const { supabase } = await import('../lib/supabase');
        
        try {
          // First, verify current password by attempting sign in
          const { error: verifyError } = await authService.signIn(currentUser.email, formData.currentPassword);
          if (verifyError) {
            setError(t('dashboard.passwordError.incorrect'));
            setIsSaving(false);
            return;
          }

          // Current password is correct, proceed with update
          // The session is now refreshed, so we can update the password
          const { error: passwordError } = await authService.updatePassword(formData.newPassword);
          if (passwordError) {
            setError(passwordError.message || t('dashboard.passwordUpdateError'));
            setIsSaving(false);
            return;
          }
          
          // Password updated successfully - clear password fields
          setFormData(prev => ({ ...prev, newPassword: '', currentPassword: '' }));
        } catch (err: any) {
          setError(err.message || t('dashboard.passwordVerifyError'));
          setIsSaving(false);
          return;
        }
      }

      // Construct updates object
      const updates: any = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        birthDate: formData.birthDate,
        country: formData.country
      };

      // Handle avatar upload if changed
      if (formData.avatarUrl && formData.avatarUrl.startsWith('data:image')) {
        const { storageService } = await import('../services/supabaseService');
        const response = await fetch(formData.avatarUrl);
        const blob = await response.blob();
        const file = new File([blob], `avatar-${currentUser.id}.png`, { type: 'image/png' });
        const uploadedUrl = await storageService.uploadAvatar(currentUser.id, file);
        if (uploadedUrl) {
          updates.avatarUrl = uploadedUrl;
        }
      } else if (formData.avatarUrl) {
        updates.avatarUrl = formData.avatarUrl;
      }

      // Handle email update if changed
      if (formData.email && formData.email !== currentUser.email) {
        const { authService } = await import('../services/supabaseService');
        const { supabase } = await import('../lib/supabase');
        
        try {
          // Update email in auth.users and public.users
          const { error: emailError } = await authService.updateEmail(formData.email, currentUser.id);
          if (emailError) {
            setError(emailError.message || t('dashboard.emailUpdateError'));
            setIsSaving(false);
            return;
          }
          
          // Email update is handled by updateEmail which uses RPC function if available
          // No need for separate confirmation step
          
          updates.email = formData.email;
        } catch (err: any) {
          setError(err.message || t('dashboard.emailUpdateError'));
          setIsSaving(false);
          return;
        }
      }

      // Only call updateUserProfile if there are actual updates (excluding email/password which are handled separately)
      if (Object.keys(updates).length > 0) {
        await updateUserProfile(currentUser.id, updates);
      }
      
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error('Error saving profile:', err);
      setError(err.message || t('dashboard.error'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatarUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const updateCountry = (code: string) => {
    const country = COUNTRIES.find(c => c.code === code) || COUNTRIES[0];
    setFormData({ ...formData, country });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in-up">
      <div className="glass-panel w-full max-w-2xl rounded-2xl p-4 md:p-8 relative border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors bg-slate-800/50 p-2 rounded-full hover:bg-slate-700 z-10"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl md:text-2xl font-bold text-white mb-6 md:mb-8 flex items-center gap-3">
          <Settings className="h-6 w-6 text-teal-300" />
          {t('dashboard.settings')}
        </h2>

        <form onSubmit={handleSave} className="space-y-6 md:space-y-8">
          
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            <div className={`relative group ${!isSaving ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`} onClick={() => !isSaving && fileInputRef.current?.click()}>
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-slate-700 overflow-hidden shadow-xl group-hover:border-teal-400 transition-colors">
                <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Camera className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="absolute bottom-0 right-0 bg-teal-400 rounded-full p-2 border-2 border-slate-900 shadow-lg">
                <div className="h-3 w-3 bg-white rounded-full"></div>
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleImageUpload}
            />
            <p className="text-xs text-gray-500">{t('dashboard.changePhoto')}</p>
          </div>

          {/* Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-gray-400">
                <UserIcon className="h-4 w-4" /> {t('dashboard.fullName')}
              </label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                disabled={isSaving}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-white focus:border-teal-400 outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="h-4 w-4" /> {t('dashboard.email')}
              </label>
              <input 
                type="email" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                disabled={isSaving}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-white focus:border-teal-400 outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-gray-400">
                <Phone className="h-4 w-4" /> {t('dashboard.phone')}
              </label>
              <input 
                type="tel" 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                disabled={isSaving}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-white focus:border-teal-400 outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            
            <div className="space-y-2">
               <label className="flex items-center gap-2 text-sm text-gray-400">
                  <Calendar className="h-4 w-4" /> {t('dashboard.birthDate')}
               </label>
               <input
                  type="date"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-white focus:border-teal-400 outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  value={formData.birthDate}
                  onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                  disabled={isSaving}
                />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="h-4 w-4" /> {t('dashboard.address')}
              </label>
              <input 
                type="text" 
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
                disabled={isSaving}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-white focus:border-teal-400 outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-gray-400">
                 <Globe className="h-4 w-4" /> {t('dashboard.country')}
              </label>
              <div className="relative">
                 <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <img
                        src={`https://flagcdn.com/w40/${formData.country.code.toLowerCase()}.png`}
                        alt={formData.country.name}
                        className="w-6 h-4 object-cover rounded-sm shadow-sm"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                 </div>
                 <select
                     className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 pl-12 text-white focus:border-teal-400 outline-none appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                     value={formData.country.code}
                     onChange={e => updateCountry(e.target.value)}
                     disabled={isSaving}
                 >
                     {COUNTRIES.map(c => (
                         <option key={c.code} value={c.code} className="bg-slate-800 text-white">
                            {c.flag} {c.name}
                         </option>
                     ))}
                 </select>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="border-t border-slate-700 pt-6">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <Lock className="h-5 w-5 text-yellow-500" /> {t('dashboard.security')}
            </h3>
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700 space-y-4">
               <div className="space-y-2 relative">
                  <label className="flex items-center gap-2 text-sm text-gray-400">
                    <Key className="h-4 w-4" /> {t('dashboard.newPassword')}
                  </label>
                  <input 
                    type={showNewPassword ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={e => setFormData({...formData, newPassword: e.target.value})}
                    placeholder="••••••••"
                    disabled={isSaving}
                    className="w-full bg-slate-800 border border-slate-600 rounded-xl p-3 pr-10 text-white focus:border-yellow-500 outline-none transition-colors placeholder-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    disabled={isSaving}
                    className="absolute right-3 top-9 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                  >
                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
               </div>
               
               {/* Current Password Field - Only visible when new password is entered */}
               {formData.newPassword.length > 0 && (
                 <div className="space-y-2 animate-fade-in-up relative">
                    <label className="flex items-center gap-2 text-sm text-yellow-500 font-bold">
                      <Lock className="h-4 w-4" /> {t('dashboard.currentPassword')}
                    </label>
                    <input 
                      type={showCurrentPassword ? "text" : "password"}
                      value={formData.currentPassword}
                      onChange={e => setFormData({...formData, currentPassword: e.target.value})}
                      placeholder={t('dashboard.currentPasswordPlaceholder')}
                      disabled={isSaving}
                      className="w-full bg-slate-800 border border-yellow-500/50 rounded-xl p-3 pr-10 text-white focus:border-yellow-500 outline-none transition-colors placeholder-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      disabled={isSaving}
                      className="absolute right-3 top-9 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                    >
                      {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                 </div>
               )}
            </div>
            
            {error && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2 animate-pulse">
                    <AlertTriangle className="h-4 w-4" /> {error}
                </div>
            )}

          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 py-3 rounded-xl bg-slate-700 text-white font-medium hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {t('dashboard.cancel')}
            </button>
            <button 
              type="submit"
              disabled={isSaving}
              className="flex-1 py-3 rounded-xl bg-teal-400 text-white font-bold hover:bg-teal-500 disabled:bg-teal-500/70 disabled:cursor-not-allowed transition-all shadow-lg shadow-teal-400/20 flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {t('dashboard.saving')}
                </>
              ) : isSaved ? (
                <>
                  <CheckCircle className="h-5 w-5" />
                  {t('dashboard.saved')}
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  {t('dashboard.save')}
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

const TransferModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { activeTransfer, startTransfer, submitSecurityCode, resetActiveTransfer, t, language } = useBank();
  const { isActive, isPaused, completed, progress, currentStepDescription: rawDescription, recipientName: activeRecipient, amount: activeAmount } = activeTransfer;
  
  // Translate currentStepDescription dynamically based on patterns - Memoized to react to language changes
  const getTranslatedDescription = React.useCallback((desc: string): string => {
    if (!desc) return '';
    
    // Match patterns in multiple languages and replace with translations
    // French patterns
    const verificationMatchFR = desc.match(/Vérification requise à (\d+)%/);
    // English patterns
    const verificationMatchEN = desc.match(/Verification required at (\d+)%/);
    // Chinese patterns
    const verificationMatchZH = desc.match(/需要在 (\d+)%/);
    // Spanish patterns
    const verificationMatchES = desc.match(/Verificación requerida en (\d+)%/);
    // German patterns
    const verificationMatchDE = desc.match(/Überprüfung erforderlich bei (\d+)%/);
    // Italian patterns
    const verificationMatchIT = desc.match(/Verifica richiesta a (\d+)%/);
    // Portuguese patterns
    const verificationMatchPT = desc.match(/Verificação necessária em (\d+)%/);
    // Dutch patterns
    const verificationMatchNL = desc.match(/Verificatie vereist op (\d+)%/);
    // Russian patterns
    const verificationMatchRU = desc.match(/Требуется проверка на (\d+)%/);
    // Japanese patterns
    const verificationMatchJA = desc.match(/で確認が必要です (\d+)%/);
    // Arabic patterns
    const verificationMatchAR = desc.match(/التحقق مطلوب في (\d+)%/);
    
    const verificationMatch = verificationMatchFR || verificationMatchEN || verificationMatchZH || 
                              verificationMatchES || verificationMatchDE || verificationMatchIT || 
                              verificationMatchPT || verificationMatchNL || verificationMatchRU || 
                              verificationMatchJA || verificationMatchAR;
    
    if (verificationMatch) {
      const percent = verificationMatch[1];
      return `${t('dashboard.transferModal.verificationRequired')} ${percent}%`;
    }
    
    // Completed patterns in multiple languages
    if (desc.includes('Transfert Terminé') || desc.includes('Transfer Completed') || 
        desc.includes('Transferencia Completada') || desc.includes('Überweisung abgeschlossen') ||
        desc.includes('Bonifico Completato') || desc.includes('Transferência Completada') ||
        desc.includes('Overboeking Voltooid') || desc.includes('Перевод завершен') ||
        desc.includes('转账完成') || desc.includes('送金が完了しました') || desc.includes('اكتمل التحويل')) {
      return t('dashboard.transferModal.transferCompleted');
    }
    
    // Initializing patterns in multiple languages
    if (desc.includes('Initialisation') || desc.includes('Initializing') ||
        desc.includes('Inicializando') || desc.includes('Initialisierung') ||
        desc.includes('Inizializzazione') || desc.includes('Inicializando') ||
        desc.includes('Initialiseren') || desc.includes('Инициализация') ||
        desc.includes('正在初始化') || desc.includes('初期化中') || desc.includes('التهيئة')) {
      return t('dashboard.transferModal.initializing');
    }
    
    // Verification success patterns in multiple languages
    if (desc.includes('Vérification réussie') || desc.includes('Verification success') ||
        desc.includes('Verificación exitosa') || desc.includes('Überprüfung erfolgreich') ||
        desc.includes('Verifica riuscita') || desc.includes('Verificação bem-sucedida') ||
        desc.includes('Verificatie succesvol') || desc.includes('Проверка успешна') ||
        desc.includes('验证成功') || desc.includes('確認成功') || desc.includes('نجح التحقق')) {
      return t('dashboard.transferModal.verificationSuccess');
    }
    
    // Processing patterns in multiple languages
    const processingMatchFR = desc.match(/Traitement en cours\.\.\. (\d+)%/);
    const processingMatchEN = desc.match(/Processing\.\.\. (\d+)%/);
    const processingMatchES = desc.match(/Procesando\.\.\. (\d+)%/);
    const processingMatchDE = desc.match(/Verarbeitung\.\.\. (\d+)%/);
    const processingMatchIT = desc.match(/Elaborazione\.\.\. (\d+)%/);
    const processingMatchPT = desc.match(/Processando\.\.\. (\d+)%/);
    const processingMatchNL = desc.match(/Verwerken\.\.\. (\d+)%/);
    const processingMatchRU = desc.match(/Обработка\.\.\. (\d+)%/);
    const processingMatchZH = desc.match(/处理中\.\.\. (\d+)%/);
    const processingMatchJA = desc.match(/処理中\.\.\. (\d+)%/);
    const processingMatchAR = desc.match(/جارٍ المعالجة\.\.\. (\d+)%/);
    
    const processingMatch = processingMatchFR || processingMatchEN || processingMatchES || 
                            processingMatchDE || processingMatchIT || processingMatchPT || 
                            processingMatchNL || processingMatchRU || processingMatchZH || 
                            processingMatchJA || processingMatchAR;
    
    if (processingMatch) {
      const percent = processingMatch[1];
      return `${t('dashboard.transferModal.processing')} ${percent}%`;
    }
    
    // If no match, return as is (might already be translated or unknown format)
    return desc;
  }, [t, language]);
  
  const currentStepDescription = React.useMemo(() => getTranslatedDescription(rawDescription), [getTranslatedDescription, rawDescription]);
  
  // Form State
  const [recipientName, setRecipientName] = useState('');
  const [bankName, setBankName] = useState('');
  const [iban, setIban] = useState('');
  const [bic, setBic] = useState('');
  const [reason, setReason] = useState('');
  const [inputAmount, setInputAmount] = useState('');
  
  const [securityCode, setSecurityCode] = useState('');
  const [codeError, setCodeError] = useState(false);
  const [fundError, setFundError] = useState(false);

  // Handle auto-close on completion
  useEffect(() => {
    if (completed) {
      const timer = setTimeout(() => {
        onClose();
        resetActiveTransfer();
      }, 3000); 
      return () => clearTimeout(timer);
    }
  }, [completed, onClose, resetActiveTransfer]);

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputAmount || !recipientName || !bankName || !iban || !bic || !reason) return;
    
    setFundError(false);
    // We pass recipientName to the context for visualization.
    const success = await startTransfer(parseFloat(inputAmount), recipientName);
    
    if (!success) {
        setFundError(true);
    }
  };

  const handleSubmitCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await submitSecurityCode(securityCode);
    if (!success) {
      setCodeError(true);
    } else {
      setCodeError(false);
      setSecurityCode('');
    }
  };

  // Helper for mobile display format: 3k, 3 M, 3Md
  const formatCompactAmount = (val: number) => {
     if (val >= 1_000_000_000) return (val / 1_000_000_000).toLocaleString('fr-FR', { maximumFractionDigits: 1 }) + 'Md';
     if (val >= 1_000_000) return (val / 1_000_000).toLocaleString('fr-FR', { maximumFractionDigits: 1 }) + ' M';
     if (val >= 1_000) return (val / 1_000).toLocaleString('fr-FR', { maximumFractionDigits: 1 }) + 'k';
     return val.toLocaleString('fr-FR', { maximumFractionDigits: 0 });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in-up">
      <div className={`glass-panel w-full ${isActive ? 'max-w-3xl' : 'max-w-2xl'} rounded-3xl p-4 md:p-8 relative border border-white/10 shadow-2xl transition-all duration-500 max-h-[90vh] overflow-y-auto custom-scrollbar`}>
        
        {/* Close / Minimize Button - Sticky to remain visible */}
        <div className="sticky top-0 right-0 w-full flex justify-end z-20 -mt-2 -mr-2 mb-2 pointer-events-none">
             <button 
                onClick={onClose} 
                className="pointer-events-auto bg-slate-800/80 hover:bg-slate-700 text-gray-400 hover:text-white transition-colors p-2 rounded-full backdrop-blur-md border border-white/10"
                title={isActive ? t('dashboard.transferModal.minimize') : t('dashboard.transferModal.close')}
            >
                {isActive && !completed ? <Minimize2 className="h-5 w-5" /> : <X className="h-5 w-5" />}
            </button>
        </div>
        
        <h2 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-2 relative z-10">
          <Send className="text-teal-300" />
          {isActive ? t('dashboard.transferModal.active') : t('dashboard.transferModal.title')}
        </h2>

        {!isActive ? (
          <form onSubmit={handleStart} className="space-y-4 md:space-y-5">
            
            {/* Source Account */}
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <label className="block text-gray-400 text-[10px] uppercase tracking-wider mb-2">{t('dashboard.transferModal.sourceAccount')}</label>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-7 bg-teal-400/20 rounded flex items-center justify-center text-teal-300">
                      <CardIcon className="h-4 w-4" />
                   </div>
                   <div className="text-white font-medium text-sm md:text-base">{t('dashboard.transferModal.mainAccount')}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {/* Beneficiary Name */}
                <div>
                    <label className="block text-gray-400 text-sm mb-1 pl-1">{t('dashboard.transferModal.recipientName')}</label>
                    <div className="relative">
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
                        <input
                            type="text"
                            required
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-12 text-white focus:border-teal-400 outline-none transition-all placeholder-gray-600"
                            value={recipientName}
                            onChange={e => setRecipientName(e.target.value)}
                            placeholder={t('dashboard.transferModal.recipientNamePlaceholder')}
                        />
                    </div>
                </div>
                
                {/* Bank Name */}
                <div>
                    <label className="block text-gray-400 text-sm mb-1 pl-1">{t('dashboard.transferModal.bankName')}</label>
                    <div className="relative">
                        <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
                        <input
                            type="text"
                            required
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-12 text-white focus:border-teal-400 outline-none transition-all placeholder-gray-600"
                            value={bankName}
                            onChange={e => setBankName(e.target.value)}
                            placeholder={t('dashboard.transferModal.bankNamePlaceholder')}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {/* IBAN */}
                <div>
                    <label className="block text-gray-400 text-sm mb-1 pl-1">{t('dashboard.transferModal.iban')}</label>
                    <div className="relative">
                        <CardIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
                        <input
                            type="text"
                            required
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-12 text-white focus:border-teal-400 outline-none transition-all placeholder-gray-600 font-mono text-sm"
                            value={iban}
                            onChange={e => setIban(e.target.value)}
                            placeholder={t('dashboard.transferModal.ibanPlaceholder')}
                        />
                    </div>
                </div>
                
                {/* BIC */}
                <div>
                    <label className="block text-gray-400 text-sm mb-1 pl-1">{t('dashboard.transferModal.bic')}</label>
                    <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
                        <input
                            type="text"
                            required
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-12 text-white focus:border-teal-400 outline-none transition-all placeholder-gray-600 font-mono text-sm"
                            value={bic}
                            onChange={e => setBic(e.target.value)}
                            placeholder={t('dashboard.transferModal.bicPlaceholder')}
                        />
                    </div>
                </div>
            </div>

            {/* Amount */}
            <div>
                <label className="block text-gray-400 text-sm mb-1 pl-1">{t('dashboard.transferModal.amount')} ({CURRENCY})</label>
                <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">€</div>
                    <input
                        type="number"
                        required
                        min="1"
                        step="0.01"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-12 text-white focus:border-teal-400 outline-none transition-all font-mono text-lg"
                        value={inputAmount}
                        onChange={e => { setInputAmount(e.target.value); setFundError(false); }}
                        placeholder="0.00"
                    />
                </div>
                {fundError && <p className="text-red-400 text-sm mt-2 flex items-center gap-1 animate-fade-in-up"><AlertTriangle className="h-3 w-3"/> {t('dashboard.transferModal.insufficientFunds')}</p>}
            </div>

             {/* Reason */}
             <div>
                <label className="block text-gray-400 text-sm mb-1 pl-1">{t('dashboard.transferModal.reason')}</label>
                    <div className="relative">
                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
                    <input
                        type="text"
                        required
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-12 text-white focus:border-teal-400 outline-none transition-all placeholder-gray-600"
                        value={reason}
                        onChange={e => setReason(e.target.value)}
                        placeholder={t('dashboard.transferModal.reasonPlaceholder')}
                    />
                </div>
            </div>

            <button className="w-full bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-300 hover:to-teal-400 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-teal-400/20 transform hover:scale-[1.02] mt-4">
              {t('dashboard.transferModal.submit')}
            </button>
          </form>
        ) : (
          <div className="space-y-8 text-center py-4 relative">
            
            {/* --- VISUALIZATION AREA --- */}
            <div className="relative h-32 md:h-40 mb-8 w-full mx-auto flex items-center justify-between px-8 md:px-6">
                
                {/* Connecting Line (Background) */}
                <div className="absolute left-16 right-16 top-1/2 h-1 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-400/30 w-full animate-pulse"></div>
                </div>

                {/* Left Node (Sender) */}
                <div className="relative z-10 flex flex-col items-center gap-3 animate-float">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-slate-800 border-2 border-teal-400 shadow-[0_0_30px_rgba(37,99,235,0.3)] flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-teal-400/10 rounded-full animate-ping-slow"></div>
                        <ShieldCheck className="h-6 w-6 md:h-10 md:w-10 text-teal-300" />
                    </div>
                    <div className="text-teal-300 font-bold text-xs md:text-sm">Golden Bank</div>
                </div>

                {/* Right Node (Receiver) */}
                <div className="relative z-10 flex flex-col items-center gap-3 animate-float-delayed">
                     <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full bg-slate-800 border-2 flex items-center justify-center transition-all duration-500 ${completed ? 'border-teal-400 shadow-[0_0_30px_rgba(37,99,235,0.5)] bg-teal-400/10' : 'border-slate-600'}`}>
                        {completed ? <CheckCircle className="h-6 w-6 md:h-10 md:w-10 text-teal-300" /> : <Landmark className="h-6 w-6 md:h-10 md:w-10 text-gray-400" />}
                    </div>
                    <div className={completed ? "text-teal-300 font-bold text-xs md:text-sm" : "text-gray-400 text-xs md:text-sm"}>
                        {activeRecipient || 'Destinataire'}
                    </div>
                </div>

                {/* MOVING PACKET (The Money) */}
                {/* 
                   Logic: 
                   Mobile: Nodes are centered at 32px (16x16 / 2) + padding 32px (px-8) = 64px from edge. 4rem.
                   Desktop: Nodes are centered at 40px (20x20 / 2) + padding 24px (px-6) = 64px from edge. 4rem.
                   Line: left-16 = 4rem.
                   So calc(4rem + ...) works perfectly for both breakpoints.
                */}
                <div 
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-200 ease-linear z-20 flex flex-col items-center"
                    style={{ left: `calc(4rem + (100% - 8rem) * ${progress / 100})` }} 
                >
                    <div className="bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.8)] flex items-center justify-center text-teal-500 font-bold border-4 border-teal-400 relative px-3 py-1.5 md:px-4 md:py-2 min-w-[70px] md:min-w-[80px]">
                        <span className="text-xs md:text-sm whitespace-nowrap">
                            {/* Mobile View: Compact */}
                            <span className="md:hidden">
                                {activeAmount ? formatCompactAmount(activeAmount) : '0'} {CURRENCY}
                            </span>
                            {/* Desktop View: Full */}
                            <span className="hidden md:inline">
                                {activeAmount?.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} {CURRENCY}
                            </span>
                        </span>
                        {/* Trail effect */}
                        <div className="absolute right-full top-1/2 -translate-y-1/2 w-16 md:w-24 h-1 bg-gradient-to-l from-white to-transparent opacity-50"></div>
                    </div>
                    <div className="mt-2 bg-slate-900/80 px-2 py-1 rounded text-[10px] text-teal-300 font-mono border border-teal-400/30 backdrop-blur-sm whitespace-nowrap">
                        {t('dashboard.transferModal.transferring')}
                    </div>
                </div>

            </div>

            {/* --- PROGRESS BAR SECTION --- */}
            <div className="relative">
                <div className="flex justify-between text-xs text-gray-400 mb-2 uppercase tracking-widest font-bold">
                    <span>{t('dashboard.transferModal.progress')}</span>
                    <span>{progress}%</span>
                </div>
                
                {/* Main Bar */}
                <div className="w-full bg-slate-800 rounded-full h-3 mb-6 overflow-hidden relative shadow-inner border border-slate-700">
                    <div 
                        className={`h-full rounded-full transition-all duration-500 ease-out relative
                        ${isPaused 
                            ? 'bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]' 
                            : 'bg-teal-400 shadow-[0_0_15px_rgba(37,99,235,0.5)]'}
                        `}
                        style={{ width: `${progress}%` }}
                    >
                        {/* Stripes */}
                        <div className="absolute inset-0 w-full h-full bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[progress-stripes_1s_linear_infinite]"></div>
                    </div>
                </div>
                
                <div className={`text-center font-mono text-xs md:text-sm transition-colors duration-300 ${isPaused ? 'text-yellow-400 animate-pulse' : 'text-teal-300'}`}>
                    {currentStepDescription}
                </div>
            </div>

            {/* --- SECURITY / VERIFICATION UI --- */}
            {isPaused && (
              <div className="mt-6 bg-slate-900/90 p-4 md:p-6 rounded-2xl border border-yellow-500/30 animate-pulse-border shadow-2xl relative overflow-hidden">
                {/* Background alert pattern */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-5"></div>
                
                <div className="relative z-10">
                    {/* Icon and Title - Centered on mobile */}
                    <div className="flex flex-col items-center mb-4 md:mb-6">
                        <div className="p-3 md:p-4 bg-yellow-500/10 rounded-full shrink-0 mb-3 md:mb-0">
                            <Lock className="h-8 w-8 md:h-10 md:w-10 text-yellow-500" />
                        </div>
                        <h3 className="text-white font-bold text-base md:text-lg text-center md:text-left w-full">{t('dashboard.transferModal.securityRequired')}</h3>
                    </div>
                    
                    {/* Content - Full width on mobile */}
                    <div className="w-full">
                        <p className="text-gray-400 text-xs md:text-sm mb-4 md:mb-6 text-center md:text-left leading-relaxed">
                            {t('dashboard.transferModal.securityDesc')}
                            <br className="hidden md:block" />
                            <span className="text-teal-300 font-medium mt-1 md:mt-0 block md:inline md:ml-1">{t('dashboard.transferModal.securityDesc2')}</span>
                        </p>

                        <form onSubmit={handleSubmitCode} className="flex flex-col md:flex-row gap-3">
                            <input
                                type="text"
                                autoFocus
                                className={`w-full md:flex-1 bg-black/50 border ${codeError ? 'border-red-500' : 'border-slate-600'} rounded-xl p-3 md:p-4 text-white text-center font-mono text-sm md:text-base lg:text-lg tracking-[0.3em] md:tracking-[0.3em] uppercase focus:border-teal-400 outline-none transition-all placeholder-gray-700`}
                                placeholder={t('dashboard.transferModal.codePlaceholder')}
                                maxLength={10}
                                value={securityCode}
                                onChange={e => setSecurityCode(e.target.value.toUpperCase())}
                            />
                            <button 
                                type="submit"
                                className="w-full md:w-auto bg-teal-400 hover:bg-teal-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold transition-all shadow-lg shadow-teal-400/20 text-sm md:text-base whitespace-nowrap"
                            >
                                {t('dashboard.transferModal.validate')}
                            </button>
                        </form>
                        {codeError && (
                            <p className="text-red-500 text-xs md:text-sm mt-3 font-bold flex items-center justify-center md:justify-start gap-1">
                                <AlertTriangle className="h-3 w-3 md:h-4 md:w-4 shrink-0"/> 
                                <span>{t('dashboard.transferModal.codeError')}</span>
                            </p>
                        )}
                    </div>
                </div>
                
                <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-white/5 text-center">
                    <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest">
                        {t('dashboard.transferModal.securedBy')}
                    </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const UserDashboard: React.FC = () => {
  const { currentUser, transactions, openLogoutModal, activeTransfer, t, language } = useBank();
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  // Memoize translated values to ensure re-render when language changes
  const translations = React.useMemo(() => ({
    hello: t('dashboard.hello'),
    currentAccount: t('dashboard.currentAccount'),
    savingsAccount: t('dashboard.savingsAccount'),
    totalBalance: t('dashboard.totalBalance'),
    transfer: t('dashboard.transfer'),
    transferResume: t('dashboard.transferResume'),
    transferPending: t('dashboard.transferPending'),
    transactionHistory: t('dashboard.transactionHistory'),
    noTransactions: t('dashboard.noTransactions'),
    receivedFrom: t('dashboard.receivedFrom'),
    transferTo: t('dashboard.transferTo'),
    completed: t('dashboard.completed'),
    pending: t('dashboard.pending'),
    failed: t('dashboard.failed'),
    cardholder: t('dashboard.cardholder'),
    expire: t('dashboard.expire'),
    totalCapital: t('dashboard.totalCapital'),
    savingsGoals: t('dashboard.savingsGoals'),
    newGoal: t('dashboard.newGoal'),
    addFunds: t('dashboard.addFunds'),
    interestProjection: t('dashboard.interestProjection'),
    interestRate: t('dashboard.interestRate'),
    interestDesc: t('dashboard.interestDesc'),
    savingsGoalDreamHome: t('dashboard.savingsGoal.dreamHome'),
    savingsGoalJapanTrip: t('dashboard.savingsGoal.japanTrip'),
    savingsGoalEmergencyFund: t('dashboard.savingsGoal.emergencyFund'),
    monthJan: t('dashboard.month.jan'),
    monthFeb: t('dashboard.month.feb'),
    monthMar: t('dashboard.month.mar'),
    monthApr: t('dashboard.month.apr'),
    monthMay: t('dashboard.month.may'),
    monthJun: t('dashboard.month.jun'),
    monthJul: t('dashboard.month.jul'),
    monthAug: t('dashboard.month.aug'),
    monthSep: t('dashboard.month.sep'),
    monthOct: t('dashboard.month.oct'),
    monthNov: t('dashboard.month.nov'),
    monthDec: t('dashboard.month.dec'),
  }), [t, language]);

  // Listen for settings open event from navbar
  useEffect(() => {
    const handleOpenSettings = () => {
      setShowSettingsModal(true);
    };
    
    window.addEventListener('openUserSettings', handleOpenSettings);
    return () => window.removeEventListener('openUserSettings', handleOpenSettings);
  }, []);

  // Auto-open modal if there is an active transfer for this user (Persistence)
  // But only if it's not completed - completed transfers should not reopen the modal
  useEffect(() => {
    if (activeTransfer.isActive && 
        activeTransfer.userId === currentUser?.id && 
        !activeTransfer.completed) {
        setShowTransferModal(true);
    } else if (activeTransfer.completed) {
        // Close modal if transfer is completed
        setShowTransferModal(false);
    }
  }, [activeTransfer.isActive, activeTransfer.userId, activeTransfer.completed, currentUser?.id]);

  if (!currentUser) return null;

  // Filter user's transactions (most recent first)
  const myTransactions = transactions
    .filter(transaction => transaction.userId === currentUser.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Check if current user has a pending transfer
  const hasActiveTransfer = activeTransfer.isActive && !activeTransfer.completed && activeTransfer.userId === currentUser.id;

  // Helper function to translate transaction recipient name
  const getTransactionDisplayName = React.useCallback((recipientName: string): string => {
    const adminDepositVariations = ['Dépôt Admin', 'Admin Deposit', 'Depósito Admin'];
    const adminWithdrawalVariations = ['Retrait Admin', 'Admin Withdrawal', 'Saque Admin'];
    
    if (adminDepositVariations.includes(recipientName)) {
      return t('dashboard.adminDeposit');
    } else if (adminWithdrawalVariations.includes(recipientName)) {
      return t('dashboard.adminWithdrawal');
    }
    return recipientName;
  }, [t, language]);

  // --- SPECIAL SAVINGS DASHBOARD ---
  if (currentUser.accountType === 'SAVINGS') {
     return (
        <div key={`savings-dashboard-container-${language}`} className="min-h-screen bg-slate-900 pt-20 px-4 pb-12">
            <div className="max-w-7xl mx-auto space-y-8">
                 {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-8">
                    <div className="flex items-center gap-4">
                        <img 
                        src={currentUser.avatarUrl} 
                        alt="Profile" 
                        className="w-16 h-16 rounded-full border-2 border-yellow-500 shadow-lg object-cover cursor-pointer hover:opacity-80 transition-opacity" 
                        onClick={() => setShowAvatarModal(true)}
                        />
                        <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                            {translations.hello}, {currentUser.name}
                            {currentUser.country && (
                                <img
                                    src={`https://flagcdn.com/w40/${currentUser.country.code.toLowerCase()}.png`}
                                    alt={currentUser.country.name}
                                    title={currentUser.country.name}
                                    className="h-6 rounded shadow-sm ml-2 hidden sm:block"
                                />
                            )}
                        </h1>
                        <p className="text-yellow-400 font-medium flex items-center gap-1 text-sm md:text-base">
                            <PiggyBank className="h-4 w-4" /> {translations.savingsAccount}
                        </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setShowSettingsModal(true)}
                            className="p-3 bg-slate-800 hover:bg-slate-700 rounded-full text-gray-300 transition-all"
                        >
                            <Settings className="h-6 w-6" />
                        </button>
                        <button onClick={openLogoutModal} className="p-3 bg-red-500/20 hover:bg-red-500/30 rounded-full text-red-400 transition-all">
                        <LogOut className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Stats */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Main Balance Card (Gold Theme) */}
                        <div className="bg-gradient-to-br from-yellow-900/40 to-slate-900 border border-yellow-500/30 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl"></div>
                            <h3 className="text-yellow-200 uppercase tracking-widest text-sm font-bold mb-2">{translations.totalCapital}</h3>
                            <div className="text-4xl md:text-5xl font-bold text-white mb-8 font-mono">
                                {currentUser.balance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} {CURRENCY}
                            </div>
                            <div className="flex items-center gap-2 text-teal-300 bg-teal-400/10 px-3 py-1 rounded-lg w-fit mb-6">
                                <TrendingUp className="h-4 w-4" /> +4.0% {translations.interestRate}
                            </div>
                            <div className="text-sm text-gray-400">
                                {translations.interestDesc}
                            </div>
                        </div>

                        {/* Savings Goals */}
                        <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/5">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Target className="h-6 w-6 text-teal-300" /> {translations.savingsGoals}
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-300">{translations.savingsGoalDreamHome}</span>
                                        <span className="text-white font-bold">45%</span>
                                    </div>
                                    <div className="w-full bg-slate-800 rounded-full h-3">
                                        <div className="bg-teal-400 h-3 rounded-full w-[45%] shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-300">{translations.savingsGoalJapanTrip}</span>
                                        <span className="text-white font-bold">12%</span>
                                    </div>
                                    <div className="w-full bg-slate-800 rounded-full h-3">
                                        <div className="bg-teal-400 h-3 rounded-full w-[12%] shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-300">{translations.savingsGoalEmergencyFund}</span>
                                        <span className="text-white font-bold">88%</span>
                                    </div>
                                    <div className="w-full bg-slate-800 rounded-full h-3">
                                        <div className="bg-yellow-500 h-3 rounded-full w-[88%] shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                                <button className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-all">
                                    {translations.newGoal}
                                </button>
                                <button className="py-3 rounded-xl bg-teal-400/20 text-teal-300 hover:bg-teal-400/30 font-bold transition-all border border-teal-400/50">
                                    {translations.addFunds}
                                </button>
                            </div>
                        </div>

                         {/* Interest Projection Graph (Simple Visual) */}
                        <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/5 relative overflow-hidden hidden md:block">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 to-transparent"></div>
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 relative z-10">
                                <Activity className="h-6 w-6 text-yellow-500" /> {translations.interestProjection}
                            </h3>
                            <div className="h-40 flex items-end justify-between gap-2 relative z-10 px-4">
                                {[20, 35, 45, 60, 55, 70, 85, 90, 100, 115, 130, 145].map((h, i) => (
                                    <div key={i} className="w-full bg-teal-400/20 rounded-t-lg hover:bg-teal-400/40 transition-colors relative group" style={{height: `${h}%`}}>
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            +{h * 5}€
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-4 text-xs text-gray-500 uppercase tracking-widest relative z-10">
                                <span>{translations.monthJan}</span><span>{translations.monthFeb}</span><span>{translations.monthMar}</span><span>{translations.monthApr}</span><span>{translations.monthMay}</span><span>{translations.monthJun}</span>
                                <span>{translations.monthJul}</span><span>{translations.monthAug}</span><span>{translations.monthSep}</span><span>{translations.monthOct}</span><span>{translations.monthNov}</span><span>{translations.monthDec}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Global Ranking Widget */}
                    <div className="lg:col-span-1">
                        <SavingsGlobalRankingWidget />
                    </div>
                </div>
            </div>
            {showSettingsModal && <SettingsModal onClose={() => setShowSettingsModal(false)} />}
            {showAvatarModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in-up cursor-zoom-out" onClick={() => setShowAvatarModal(false)}>
                    <div className="relative max-w-4xl max-h-[90vh] p-2">
                        <img 
                            src={currentUser.avatarUrl} 
                            alt="Profile Fullscreen" 
                            className="w-full h-full object-contain max-h-[85vh] rounded-lg shadow-2xl border border-white/10"
                        />
                        <button 
                            className="absolute -top-12 right-0 text-white hover:text-gray-300 p-2"
                            onClick={() => setShowAvatarModal(false)}
                        >
                            <X className="h-8 w-8" />
                        </button>
                    </div>
                </div>
            )}
        </div>
     );
  }

  // --- STANDARD CURRENT ACCOUNT DASHBOARD ---
  return (
    <div key={`dashboard-container-${language}`} className="min-h-screen bg-slate-900 pt-20 px-4 pb-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <img 
              src={currentUser.avatarUrl} 
              alt="Profile" 
              className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-teal-400 shadow-lg object-cover cursor-pointer hover:opacity-80 transition-opacity" 
              onClick={() => setShowAvatarModal(true)}
            />
            <div>
              <h1 key={`hello-${language}`} className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                {translations.hello}, {currentUser.name}
                {currentUser.country && (
                    <img
                        src={`https://flagcdn.com/w40/${currentUser.country.code.toLowerCase()}.png`}
                        alt={currentUser.country.name}
                        title={currentUser.country.name}
                        className="h-6 rounded shadow-sm ml-2 hidden sm:block"
                    />
                )}
              </h1>
              <p className="text-teal-300 font-medium flex items-center gap-2 text-sm md:text-base">
                 <Wallet className="h-4 w-4" /> {translations.currentAccount} <span className="text-gray-400 font-normal text-xs md:text-sm hidden sm:inline">• {currentUser.email}</span>
              </p>
            </div>
          </div>
          <div className="flex gap-3 absolute top-20 right-4 md:static">
            {/* Hide settings button on mobile - it's now in the navbar menu */}
            <button 
                onClick={() => setShowSettingsModal(true)}
                className="hidden md:flex p-2 md:p-3 bg-slate-800 hover:bg-slate-700 rounded-full text-gray-300 transition-all"
            >
              <Settings className="h-5 w-5 md:h-6 md:w-6" />
            </button>
            <button onClick={openLogoutModal} className="p-2 md:p-3 bg-red-500/20 hover:bg-red-500/30 rounded-full text-red-400 transition-all">
              <LogOut className="h-5 w-5 md:h-6 md:w-6" />
            </button>
          </div>
        </div>

        {/* Main Grid - Moved above Stock Market Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Card & Balance - STICKY only on Desktop (lg) */}
          <div className="lg:col-span-1 space-y-8 relative lg:sticky lg:top-24 lg:self-start">
            <CreditCardDisplay key={`credit-card-${language}`} />
            
            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
              <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">{translations.totalBalance}</h3>
              <div className="flex items-center justify-between">
                <div className="text-3xl md:text-4xl font-bold text-white mb-6">
                    {currentUser.balance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} {CURRENCY}
                </div>
              </div>
              
              <button 
                onClick={() => setShowTransferModal(true)}
                className={`w-full font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] ${
                    hasActiveTransfer 
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-slate-900 shadow-yellow-500/20' 
                    : 'bg-teal-400 hover:bg-teal-500 text-white shadow-teal-400/20'
                }`}
              >
                {hasActiveTransfer ? (
                    <>
                        <Lock className="h-5 w-5" />
                        <span>{translations.transferResume} ({activeTransfer.progress}%)</span>
                    </>
                ) : (
                    <>
                        <Send className="h-5 w-5" />
                        <span>{translations.transfer}</span>
                    </>
                )}
              </button>
              {hasActiveTransfer && (
                  <p className="text-center text-xs text-yellow-500 mt-2 animate-pulse">{translations.transferPending}</p>
              )}
            </div>
          </div>

          {/* Right Column: History - NOW STANDALONE in the column */}
          <div className="lg:col-span-2">
            <div className="glass-panel rounded-2xl p-4 md:p-8 h-full min-h-[400px] md:min-h-[600px]">
              <div className="flex items-center gap-3 mb-6 md:mb-8">
                <History className="h-6 w-6 text-teal-300" />
                <h2 className="text-xl md:text-2xl font-bold text-white">{translations.transactionHistory}</h2>
              </div>

              {myTransactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <AlertTriangle className="h-12 w-12 mb-4 opacity-50" />
                  <p>{translations.noTransactions}</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {myTransactions.map((transaction) => {
                    const isCredit = transaction.type === 'CREDIT';
                    return (
                      <div key={transaction.id} className="bg-slate-800/50 p-3 md:p-4 rounded-xl flex justify-between items-center hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700 animate-fade-in-up">
                        <div className="flex items-center gap-3 md:gap-4">
                          <div className={`h-8 w-8 md:h-10 md:w-10 rounded-full flex items-center justify-center shadow-inner shrink-0 ${
                              isCredit ? 'bg-teal-400/20 text-teal-300' : 'bg-slate-700 text-white'
                          }`}>
                            {isCredit ? <ArrowDownLeft className="h-4 w-4 md:h-5 md:w-5" /> : <ArrowUpRight className="h-4 w-4 md:h-5 md:w-5" />}
                          </div>
                          <div className="min-w-0">
                            <div className="text-white font-medium text-sm md:text-base truncate max-w-[120px] md:max-w-xs">
                                {isCredit ? `${translations.receivedFrom} ${getTransactionDisplayName(transaction.recipientName)}` : `${translations.transferTo} ${getTransactionDisplayName(transaction.recipientName)}`}
                            </div>
                            <div className="text-gray-500 text-[10px] md:text-xs">{new Date(transaction.date).toLocaleString()}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold text-sm md:text-lg ${isCredit ? 'text-teal-400' : 'text-white'}`}>
                              {isCredit ? '+' : '-'} {transaction.amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} {CURRENCY}
                          </div>
                          <div className={`text-[10px] font-bold uppercase tracking-wider ${
                            transaction.status === 'COMPLETED' ? 'text-teal-400' : 'text-yellow-500'
                          }`}>
                            {transaction.status === 'COMPLETED' ? translations.completed : transaction.status === 'PENDING' ? translations.pending : translations.failed}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stock Market Widget - Moved to Bottom */}
        <StockMarketWidget />
        
      </div>

      {showTransferModal && <TransferModal onClose={() => setShowTransferModal(false)} />}
      {showSettingsModal && <SettingsModal onClose={() => setShowSettingsModal(false)} />}
      {showAvatarModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in-up cursor-zoom-out" onClick={() => setShowAvatarModal(false)}>
            <div className="relative max-w-4xl max-h-[90vh] p-2">
                <img 
                    src={currentUser.avatarUrl} 
                    alt="Profile Fullscreen" 
                    className="w-full h-full object-contain max-h-[85vh] rounded-lg shadow-2xl border border-white/10"
                />
                <button 
                    className="absolute -top-12 right-0 text-white hover:text-gray-300 p-2"
                    onClick={() => setShowAvatarModal(false)}
                >
                    <X className="h-8 w-8" />
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
