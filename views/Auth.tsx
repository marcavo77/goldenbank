
import React, { useState, useRef } from 'react';
import { useBank } from '../context/BankContext';
import { User, Lock, Mail, ArrowRight, ArrowLeft, MapPin, Phone, Calendar, Globe, Upload, CreditCard, PiggyBank, Check, Camera, AlertCircle, Eye, EyeOff, AlertTriangle, Loader2 } from 'lucide-react';
import { COUNTRIES, MOCK_ADMIN_USER } from '../constants';
import { RegisterData } from '../context/BankContext';
import { Country, AccountType } from '../types';

export const Auth: React.FC = () => {
  const { view, login, register, setView, t } = useBank();
  const [error, setError] = useState('');
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Registration State - Multi Step
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    email: '',
    password: '',
    birthDate: '',
    phone: '',
    address: '',
    postalCode: '',
    country: COUNTRIES.find(c => c.code === 'PT') || COUNTRIES[0],
    accountType: 'CURRENT',
    avatarUrl: ''
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper: Check Password Match Realtime
  const isPasswordValid = formData.password.length >= 6;
  const isPasswordMatching = formData.password === confirmPassword && formData.password !== '';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);
    try {
      const success = await login(loginEmail, loginPassword);
      if (!success) {
        setError(t('auth.login.error'));
      }
    } catch (err: any) {
      setError(err.message || t('auth.login.error.generic'));
    } finally {
      setIsLoggingIn(false);
    }
  };

  const calculateAge = (birthDateString: string) => {
    const today = new Date();
    const birthDate = new Date(birthDateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
  };

  const handleNextStep = () => {
    setError('');
    if (step === 1) {
        if (!formData.name || !formData.email || !formData.birthDate) {
            setError(t('auth.register.error.personal'));
            return;
        }
        const age = calculateAge(formData.birthDate);
        if (age < 18) {
            setError(t('auth.register.error.age'));
            return;
        }
    }
    if (step === 2) {
        if (!formData.address || !formData.postalCode || !formData.phone) {
            setError(t('auth.register.error.address'));
            return;
        }
    }
    setStep(step + 1);
  };

  const handlePrevStep = () => setStep(step - 1);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isPasswordValid) {
        setError(t('auth.register.passwordError'));
        return;
    }

    if (!isPasswordMatching) {
      setError(t('auth.register.passwordMismatch'));
      return;
    }

    setIsRegistering(true);
    try {
      await register(formData);
    } catch (err: any) {
      setError(err.message || t('auth.register.error.generic'));
      setIsRegistering(false);
    }
  };

  const updateCountry = (code: string) => {
    const country = COUNTRIES.find(c => c.code === code) || COUNTRIES[0];
    setFormData({ ...formData, country });
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

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // --- LOGIN VIEW ---
  if (view === 'LOGIN') {
    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 pt-16">
          <div className="max-w-md w-full glass-panel p-8 rounded-2xl shadow-2xl animate-fade-in-up">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">{t('auth.login.title')}</h2>
              <p className="text-gray-400">{t('auth.login.subtitle')}</p>
            </div>
    
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  placeholder={t('auth.login.email')}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 text-white focus:outline-none focus:border-teal-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  disabled={isLoggingIn}
                  required
                />
              </div>
    
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                <input
                  type={showLoginPassword ? "text" : "password"}
                  placeholder={t('auth.login.password')}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-10 text-white focus:outline-none focus:border-teal-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  disabled={isLoggingIn}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                  disabled={isLoggingIn}
                >
                  {showLoginPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
    
              {error && <p className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded">{error}</p>}
    
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-teal-400 hover:bg-teal-500 disabled:bg-teal-500/70 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-teal-400/20 flex items-center justify-center gap-2"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t('auth.login.submitting')}
                  </>
                ) : (
                  <>
                    {t('auth.login.submit')}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
    
            <div className="mt-6 text-center">
              <button
                onClick={() => setView('REGISTER')}
                disabled={isLoggingIn}
                className="text-teal-300 hover:text-teal-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                {t('auth.login.noAccount')}
              </button>
            </div>
          </div>
        </div>
      );
  }

  // --- REGISTER VIEW (Multi-step) ---
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 pt-20 pb-10">
      <div className="max-w-2xl w-full glass-panel p-8 rounded-2xl shadow-2xl animate-fade-in-up">
        
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-8 relative">
            <div className="absolute left-0 right-0 top-1/2 h-1 bg-slate-700 -z-10"></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= 1 ? 'bg-teal-400 text-white' : 'bg-slate-700 text-gray-400'}`}>1</div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= 2 ? 'bg-teal-400 text-white' : 'bg-slate-700 text-gray-400'}`}>2</div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= 3 ? 'bg-teal-400 text-white' : 'bg-slate-700 text-gray-400'}`}>3</div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">{t('auth.register.title')}</h2>
          <p className="text-gray-400">
            {step === 1 && t('auth.register.step1')}
            {step === 2 && t('auth.register.step2')}
            {step === 3 && t('auth.register.step3')}
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          
          {/* STEP 1: IDENTITY */}
          {step === 1 && (
             <div className="space-y-4">
                <div className="flex justify-center mb-6">
                    <div className={`relative group ${!isRegistering ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`} onClick={() => !isRegistering && triggerFileInput()}>
                        <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-dashed border-slate-600 flex items-center justify-center overflow-hidden hover:border-teal-400 transition-colors">
                            {formData.avatarUrl ? (
                                <img src={formData.avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center text-gray-500">
                                    <Camera className="h-8 w-8 mx-auto mb-1" />
                                    <span className="text-[10px]">{t('auth.register.addPhoto')}</span>
                                </div>
                            )}
                        </div>
                        <div className="absolute bottom-0 right-0 bg-teal-400 rounded-full p-1.5 shadow-lg border-2 border-slate-900">
                             <Upload className="h-3 w-3 text-white" />
                        </div>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <User className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder={t('auth.register.fullName')}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 text-white focus:outline-none focus:border-teal-400 disabled:opacity-50 disabled:cursor-not-allowed"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            disabled={isRegistering}
                            required
                        />
                    </div>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                        <input
                            type="date"
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 text-white focus:outline-none focus:border-teal-400 placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            value={formData.birthDate}
                            onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                            disabled={isRegistering}
                            required
                        />
                    </div>
                </div>
                <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                    <input
                        type="email"
                        placeholder={t('auth.register.email')}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 text-white focus:outline-none focus:border-teal-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        disabled={isRegistering}
                        required
                    />
                </div>
                <p className="text-xs text-gray-500 text-center italic">{t('auth.register.ageWarning')}</p>
             </div>
          )}

          {/* STEP 2: ADDRESS */}
          {step === 2 && (
             <div className="space-y-4">
                <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder={t('auth.register.address')}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 text-white focus:outline-none focus:border-teal-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        value={formData.address}
                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                        disabled={isRegistering}
                        required
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder={t('auth.register.postalCode')}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-teal-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        value={formData.postalCode}
                        onChange={e => setFormData({ ...formData, postalCode: e.target.value })}
                        disabled={isRegistering}
                        required
                    />
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
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-12 text-white focus:outline-none focus:border-teal-400 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            value={formData.country.code}
                            onChange={e => updateCountry(e.target.value)}
                            disabled={isRegistering}
                            required
                        >
                            {COUNTRIES.map(c => (
                                <option key={c.code} value={c.code} className="bg-slate-800 text-white">
                                    {c.flag} {c.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="relative">
                    <Phone className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                    <input
                        type="tel"
                        placeholder={t('auth.register.phone')}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 text-white focus:outline-none focus:border-teal-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        disabled={isRegistering}
                        required
                    />
                </div>
             </div>
          )}

          {/* STEP 3: ACCOUNT TYPE & PASSWORD */}
          {step === 3 && (
            <div className="space-y-6">
                
                {/* Account Selection */}
                <div className="grid grid-cols-2 gap-4">
                    <div 
                        onClick={() => setFormData({...formData, accountType: 'CURRENT'})}
                        className={`cursor-pointer p-4 rounded-xl border-2 transition-all text-center ${formData.accountType === 'CURRENT' ? 'border-teal-400 bg-teal-400/10' : 'border-slate-700 bg-slate-800 hover:border-slate-500'}`}
                    >
                        <CreditCard className={`h-8 w-8 mx-auto mb-2 ${formData.accountType === 'CURRENT' ? 'text-teal-300' : 'text-gray-400'}`} />
                        <div className="font-bold text-white">{t('auth.register.accountType.current')}</div>
                        <div className="text-xs text-gray-500 mt-1">{t('auth.register.accountType.currentDesc')}</div>
                    </div>
                    <div 
                        onClick={() => !isRegistering && setFormData({...formData, accountType: 'SAVINGS'})}
                        className={`${!isRegistering ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'} p-4 rounded-xl border-2 transition-all text-center ${formData.accountType === 'SAVINGS' ? 'border-yellow-500 bg-yellow-500/10' : 'border-slate-700 bg-slate-800 hover:border-slate-500'}`}
                    >
                        <PiggyBank className={`h-8 w-8 mx-auto mb-2 ${formData.accountType === 'SAVINGS' ? 'text-yellow-400' : 'text-gray-400'}`} />
                        <div className="font-bold text-white">{t('auth.register.accountType.savings')}</div>
                        <div className="text-xs text-gray-500 mt-1">{t('auth.register.accountType.savingsDesc')}</div>
                    </div>
                </div>

                <div className="space-y-4 border-t border-slate-700 pt-6">
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                        <input
                            type={showRegisterPassword ? "text" : "password"}
                            placeholder={t('auth.register.password')}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-10 text-white focus:outline-none focus:border-teal-400 disabled:opacity-50 disabled:cursor-not-allowed"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            disabled={isRegistering}
                            required
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                          disabled={isRegistering}
                        >
                          {showRegisterPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder={t('auth.register.confirmPassword')}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-10 text-white focus:outline-none focus:border-teal-400 disabled:opacity-50 disabled:cursor-not-allowed"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            disabled={isRegistering}
                            required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                          disabled={isRegistering}
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            </div>
          )}
          
          {/* Dynamic Feedback for Password Match */}
          {step === 3 && isPasswordMatching && isPasswordValid ? (
             <div className="bg-teal-400/20 border border-teal-400/50 rounded-xl p-3 flex items-center justify-center gap-2 animate-fade-in-up">
                <Check className="h-5 w-5 text-teal-300" />
                <span className="text-teal-300 text-sm font-bold">{t('auth.register.passwordValid')}</span>
             </div>
          ) : (
            error && <p className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded animate-pulse flex items-center justify-center gap-2">
                <AlertTriangle className="h-4 w-4" /> {error}
            </p>
          )}

          <div className="flex gap-4 pt-4">
              {step > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    disabled={isRegistering}
                    className="px-6 py-3 rounded-xl border border-slate-600 text-gray-300 hover:text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" /> {t('common.back')}
                  </button>
              )}
              
              {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={isRegistering}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    {t('common.next')} <ArrowRight className="h-4 w-4" />
                  </button>
              ) : (
                  <button
                    type="submit"
                    disabled={isRegistering}
                    className="flex-1 bg-teal-400 hover:bg-teal-500 disabled:bg-teal-500/70 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-teal-400/20 flex items-center justify-center gap-2"
                  >
                    {isRegistering ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t('auth.register.submitting')}
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" /> {t('auth.register.submit')}
                      </>
                    )}
                  </button>
              )}
          </div>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setView('LOGIN')}
            disabled={isRegistering}
            className="text-teal-300 hover:text-teal-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            {t('auth.register.hasAccount')}
          </button>
        </div>
      </div>
    </div>
  );
};
