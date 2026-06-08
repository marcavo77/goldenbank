import React, { useState, useMemo, useEffect } from 'react';
import { useBank } from '../context/BankContext';
import { User, Search, PlusCircle, MinusCircle, ShieldAlert, Filter, Calendar, DollarSign, Activity, Lock, Copy, X, AlertTriangle, Trash2, ArrowDownLeft, ArrowUpRight, FileText, ClipboardList, Info, MapPin, Phone, Mail, CreditCard, Globe, Check, Settings, Eye, EyeOff, Key, Loader2 } from 'lucide-react';
import { CURRENCY } from '../constants';
import { ActiveTransfer, User as UserType } from '../types';
import { authService, userService } from '../services/supabaseService';
import { supabase } from '../lib/supabase';

// Admin Settings Modal Component - Defined outside to prevent re-creation on re-renders
const AdminSettingsModal: React.FC<{ onClose: () => void; currentUser: UserType }> = ({ onClose, currentUser }) => {
  const { t } = useBank();
  const [email, setEmail] = useState(currentUser?.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Update email when currentUser changes
  useEffect(() => {
    if (currentUser?.email) {
      setEmail(currentUser.email);
    }
  }, [currentUser?.email]);

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!email || email === currentUser?.email) {
      setError(t('admin.emailError'));
      return;
    }

    setIsLoading(true);
    try {
      // Update email in auth.users and public.users
      const { error: updateError } = await authService.updateEmail(email, currentUser!.id);
      if (updateError) {
        throw new Error(updateError.message || t('admin.emailUpdateError'));
      }
      
      // Email update is handled by updateEmail which uses RPC function if available
      // The RPC function updates both auth.users and public.users directly
      
      setSuccess(t('admin.emailSuccess'));
      setTimeout(() => {
        setSuccess('');
        onClose();
        // Optionally reload after a delay
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }, 2000);
    } catch (err: any) {
      setError(err.message || t('admin.emailUpdateError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!newPassword || newPassword.length < 6) {
      setError(t('admin.passwordError.length'));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t('admin.passwordError.mismatch'));
      return;
    }

    setIsLoading(true);
    try {
      const { error: updateError } = await authService.updatePassword(newPassword);
      if (updateError) {
        throw new Error(updateError.message || t('admin.passwordUpdateError'));
      }
      
      setSuccess(t('admin.passwordSuccess'));
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setSuccess('');
      }, 2000);
    } catch (err: any) {
      setError(err.message || t('admin.passwordUpdateError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="glass-panel w-full max-w-2xl rounded-2xl p-6 md:p-8 relative border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors bg-slate-800/50 p-2 rounded-full hover:bg-slate-700 z-10"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl md:text-2xl font-bold text-white mb-6 md:mb-8 flex items-center gap-3">
          <Settings className="h-6 w-6 text-teal-300" />
          {t('admin.settings')}
        </h2>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm flex items-center gap-2 mb-6">
            <AlertTriangle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-teal-400/20 border border-teal-400/50 rounded-lg p-3 text-teal-300 text-sm flex items-center gap-2 mb-6">
            <Check className="h-4 w-4" />
            <span>{success}</span>
          </div>
        )}

        <div className="space-y-8">
          {/* Update Email Section */}
          <form onSubmit={handleUpdateEmail} className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Mail className="h-5 w-5 text-teal-300" />
              {t('admin.updateEmail')}
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('admin.currentEmail')}
              </label>
              <input
                type="text"
                value={currentUser?.email || ''}
                disabled
                className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2 text-gray-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('admin.newEmail')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-400"
                placeholder={t('admin.newEmailPlaceholder')}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || email === currentUser?.email}
              className="w-full py-3 bg-teal-400 hover:bg-teal-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all shadow-lg shadow-teal-400/20"
            >
              {isLoading ? t('admin.updating') : t('admin.updateEmailButton')}
            </button>
          </form>

          <div className="border-t border-slate-700"></div>

          {/* Update Password Section */}
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Key className="h-5 w-5 text-teal-300" />
              {t('admin.updatePassword')}
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('admin.newPassword')}
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 pr-10 text-white focus:outline-none focus:border-teal-400"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('admin.confirmPassword')}
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 pr-10 text-white focus:outline-none focus:border-teal-400"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !newPassword || !confirmPassword}
              className="w-full py-3 bg-teal-400 hover:bg-teal-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all shadow-lg shadow-teal-400/20"
            >
              {isLoading ? t('admin.updating') : t('admin.updatePasswordButton')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const { users, currentUser, openLogoutModal, updateUserBalance, deleteUser, transactions, allActiveTransfers, adminLogs, isLoading, t } = useBank();
  
  // User Search State
  const [searchTerm, setSearchTerm] = useState('');

  // Transaction Filter State
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED' | 'FAILED'>('ALL');
  
  // Copy Feedback State
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Modal State for Balance Updates
  const [transModal, setTransModal] = useState<{
    isOpen: boolean;
    userId: string | null;
    userName: string;
    type: 'CREDIT' | 'DEBIT';
    currentBalance: number;
  }>({
    isOpen: false,
    userId: null,
    userName: '',
    type: 'CREDIT',
    currentBalance: 0
  });
  const [amountInput, setAmountInput] = useState('');
  const [isProcessingTransaction, setIsProcessingTransaction] = useState(false);
  const [transactionError, setTransactionError] = useState('');
  
  // Modal State for Deletion
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    userId: string | null;
    userName: string;
  }>({
    isOpen: false,
    userId: null,
    userName: ''
  });
  const [deleteError, setDeleteError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Modal State for User Details
  const [userDetailsModal, setUserDetailsModal] = useState<{
    isOpen: boolean;
    user: UserType | null;
  }>({
    isOpen: false,
    user: null
  });

  // Modal State for Admin Settings
  const [showAdminSettingsModal, setShowAdminSettingsModal] = useState(false);

  // Listen for settings open event from navbar
  useEffect(() => {
    const handleOpenSettings = () => {
      setShowAdminSettingsModal(true);
    };
    
    window.addEventListener('openAdminSettings', handleOpenSettings);
    return () => window.removeEventListener('openAdminSettings', handleOpenSettings);
  }, []);

  if (!currentUser || currentUser.role !== 'ADMIN') return null;

  // Calculate total client balance (Encours Clients) - calculate directly in render
  // This ensures it always uses the latest users data
  const calculateEncours = () => {
    // Don't calculate if still loading
    if (isLoading) {
      return 0;
    }
    
    // Only calculate if we have users loaded
    if (!users || users.length === 0) {
      return 0;
    }
    
    const userClients = users.filter(u => u.role === 'USER');
    const total = userClients.reduce((acc, curr) => {
      const balance = typeof curr.balance === 'string' 
        ? parseFloat(curr.balance) || 0
        : (curr.balance || 0);
      // Ensure balance is a valid number
      const numBalance = isNaN(balance) ? 0 : balance;
      return acc + numBalance;
    }, 0);
    
    return total;
  };
  
  const totalClientBalance = calculateEncours();
  
  // Debug: Log whenever users changes
  useEffect(() => {
    if (!isLoading && users.length > 0) {
      const calculated = calculateEncours();
      console.log(`🔄 AdminDashboard - users: ${users.length}, calculated encours: ${calculated} ${CURRENCY}`);
    }
  }, [users, isLoading]);

  // Filter Users - use useMemo to ensure it updates when users changes
  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.role === 'USER' && 
      (u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.includes(searchTerm))
    );
  }, [users, searchTerm]);

  // Filter Transactions
  // Sort transactions by date (most recent first) before filtering
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const filteredTransactions = sortedTransactions.filter(transaction => {
    const tDate = new Date(transaction.date);
    const start = dateStart ? new Date(dateStart) : null;
    const end = dateEnd ? new Date(dateEnd) : null;
    
    // Normalize dates for comparison (ignore time)
    if (start) start.setHours(0,0,0,0);
    if (end) end.setHours(23,59,59,999);

    const matchesDate = (!start || tDate >= start) && (!end || tDate <= end);
    const amount = typeof transaction.amount === 'string' ? parseFloat(transaction.amount) : (transaction.amount || 0);
    const matchesMin = !minAmount || amount >= parseFloat(minAmount);
    const matchesMax = !maxAmount || amount <= parseFloat(maxAmount);
    const matchesStatus = statusFilter === 'ALL' || transaction.status === statusFilter;

    return matchesDate && matchesMin && matchesMax && matchesStatus;
  });

  // Modal Handlers
  const openTransactionModal = (user: any, type: 'CREDIT' | 'DEBIT') => {
    // Find the latest user data from the users list to get the most current balance
    const currentUserData = users.find(u => u.id === user.id) || user;
    setTransModal({
      isOpen: true,
      userId: currentUserData.id,
      userName: currentUserData.name,
      type,
      currentBalance: currentUserData.balance
    });
    setAmountInput('');
    setTransactionError('');
  };

  const closeTransactionModal = () => {
    setTransModal(prev => ({ ...prev, isOpen: false }));
    setAmountInput('');
    setTransactionError('');
    setIsProcessingTransaction(false);
  };

  const handleConfirmTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transModal.userId) return;
    
    setTransactionError('');
    setIsProcessingTransaction(true);
    
    const amount = parseFloat(amountInput);
    if (isNaN(amount) || amount <= 0) {
      setTransactionError(t('admin.amountError'));
      setIsProcessingTransaction(false);
      return;
    }

    // Get fresh user data from the users list (which should be updated after reloads)
    const targetUser = users.find(u => u.id === transModal.userId);
    const currentBalance = targetUser?.balance || transModal.currentBalance;

    const finalAmount = transModal.type === 'CREDIT' ? amount : -amount;
    
    // Vérifier que le solde ne devienne pas trop négatif pour un débit
    if (transModal.type === 'DEBIT' && (currentBalance + finalAmount) < -1000) {
      setTransactionError(t('admin.balanceLimitError'));
      setIsProcessingTransaction(false);
      return;
    }

    try {
      console.log(`Admin transaction: User ${transModal.userId}, type: ${transModal.type}, amount: ${finalAmount}, current balance: ${currentBalance}`);
      await updateUserBalance(transModal.userId, finalAmount);
      console.log(`Admin transaction completed successfully`);
      
      // The reload is already handled in updateUserBalance function in the context
      // The UI will update automatically when users state changes
      
      closeTransactionModal();
      setTransactionError('');
    } catch (error: any) {
      console.error('Error updating balance:', error);
      setTransactionError(error.message || t('admin.balanceUpdateError'));
    } finally {
      setIsProcessingTransaction(false);
    }
  };
  
  const openDeleteModal = (user: any) => {
    setDeleteModal({
      isOpen: true,
      userId: user.id,
      userName: user.name
    });
    setDeleteError('');
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      userId: null,
      userName: ''
    });
    setDeleteError('');
    setIsDeleting(false);
  };

  const handleConfirmDelete = async () => {
    if (deleteModal.userId) {
      setDeleteError('');
      setIsDeleting(true);
      try {
        await deleteUser(deleteModal.userId);
        closeDeleteModal();
      } catch (error: any) {
        console.error('Error deleting user:', error);
        setDeleteError(error.message || t('admin.deleteError') || 'Une erreur est survenue lors de la suppression');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const openUserDetails = (user: UserType) => {
    setUserDetailsModal({
      isOpen: true,
      user
    });
  };

  const closeUserDetails = () => {
    setUserDetailsModal({
      isOpen: false,
      user: null
    });
  };
  
  const handleCopyCode = (code: string, id: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Find ALL active transfers that are paused (waiting for code)
  const blockedTransfers = (Object.values(allActiveTransfers) as ActiveTransfer[]).filter(transfer => transfer.isActive && transfer.isPaused && transfer.requiredCode && transfer.userId);

  return (
    <div className="min-h-screen bg-slate-900 pt-20 px-4 pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-10">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{t('admin.title')}</h1>
            <p className="text-gray-400 text-sm md:text-base">{t('admin.subtitle')}</p>
          </div>
          <div className="flex gap-3">
            {/* Hide settings button on mobile - it's now in the navbar menu */}
            <button 
              onClick={() => setShowAdminSettingsModal(true)}
              className="hidden md:flex p-3 bg-slate-800 hover:bg-slate-700 rounded-full text-gray-300 transition-all"
              title={t('admin.settings')}
            >
              <Settings className="h-6 w-6" />
            </button>
            <button onClick={openLogoutModal} className="px-4 md:px-6 py-2 bg-red-500/20 text-red-400 rounded-lg font-bold hover:bg-red-500/30 text-sm md:text-base">
              {t('admin.closeSession')}
            </button>
          </div>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
          <div className="glass-panel p-4 md:p-6 rounded-xl">
             <div className="text-gray-400 mb-1 md:mb-2 text-sm md:text-base">{t('admin.clients')}</div>
             <div className="text-2xl md:text-3xl font-bold text-white">{users.filter(u => u.role === 'USER').length}</div>
          </div>
          <div className="glass-panel p-4 md:p-6 rounded-xl">
             <div className="text-gray-400 mb-1 md:mb-2 text-sm md:text-base">{t('admin.clientBalance')}</div>
             <div className="text-2xl md:text-3xl font-bold text-teal-300 truncate text-2xl">
                {isLoading ? (
                  <span className="text-gray-500">{t('common.loading')}</span>
                ) : (
                  totalClientBalance.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ' + CURRENCY
                )}
             </div>
          </div>
          <div className="glass-panel p-4 md:p-6 rounded-xl">
             <div className="text-gray-400 mb-1 md:mb-2 text-sm md:text-base">{t('admin.transactionVolume')}</div>
             <div className="text-2xl md:text-3xl font-bold text-teal-300 truncate text-2xl">
                {transactions
                  .reduce((acc, curr) => {
                    const amount = typeof curr.amount === 'string' ? parseFloat(curr.amount) : (curr.amount || 0);
                    return acc + amount;
                  }, 0)
                  .toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {CURRENCY}
             </div>
          </div>
          <div className="glass-panel p-4 md:p-6 rounded-xl border border-red-500/20">
             <div className="text-gray-400 mb-1 md:mb-2 flex items-center gap-2 text-sm md:text-base">
               <ShieldAlert className="h-4 w-4 text-red-500"/>{t('admin.security')}
             </div>
             <div className="text-2xl md:text-3xl font-bold text-white">{t('admin.systemOk')}</div>
          </div>
        </div>

        {/* --- SECURITY CENTER (Active Transfer Monitor) --- */}
        {blockedTransfers.length > 0 && (
          <div className="mb-10 animate-fade-in-up space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
              <ShieldAlert className="text-red-500 animate-pulse h-5 w-5 md:h-6 md:w-6" /> {t('admin.securityCenter')} ({blockedTransfers.length})
            </h2>
            
            {blockedTransfers.map((transfer) => {
                const user = users.find(u => u.id === transfer.userId);
                const isCopied = copiedId === transfer.userId;
                
                return (
                    <div key={transfer.userId} className="bg-red-500/10 border border-red-500/50 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-red-500 blur-lg opacity-20 animate-pulse rounded-full"></div>
                                <Lock className="h-12 w-12 text-red-400 relative z-10" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">{t('admin.validationRequired')}</h3>
                                <p className="text-red-200">
                                    {t('admin.client')} <span className="font-bold text-white">{user?.name || t('admin.unknown')}</span> <br/>
                                    {t('admin.amount')} <span className="font-bold text-white">{transfer.amount} {CURRENCY}</span> {t('admin.to')} {transfer.recipientName}
                                </p>
                                <div className="mt-2 text-xs uppercase tracking-widest text-red-400 font-bold bg-red-950/50 px-2 py-1 rounded inline-block">
                                   {t('admin.blockedAt')} {transfer.progress}%
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 flex flex-col items-center gap-2 min-w-[300px]">
                            <span className="text-gray-500 text-xs uppercase tracking-widest mb-1">{t('admin.securityCode')}</span>
                            <div className="flex items-center gap-3 w-full justify-center bg-slate-800 p-3 rounded-lg border border-slate-600 transition-colors">
                                <code className="text-3xl font-mono font-bold text-white tracking-[0.2em]">{transfer.requiredCode}</code>
                                <button 
                                    onClick={() => handleCopyCode(transfer.requiredCode || '', transfer.userId || 'unknown')}
                                    className={`p-2 rounded-md transition-all duration-300 transform ${
                                      isCopied 
                                      ? 'bg-teal-400 text-white scale-110 shadow-lg shadow-teal-400/50' 
                                      : 'hover:bg-slate-700 text-gray-400 hover:text-white'
                                    }`}
                                    title={isCopied ? t('chat.copied') : t('admin.copyCode')}
                                >
                                    {isCopied ? <Check className="h-5 w-5 animate-bounce" /> : <Copy className="h-5 w-5" />}
                                </button>
                            </div>
                            <p className={`text-xs mt-2 text-center transition-colors duration-300 ${isCopied ? 'text-teal-300 font-bold' : 'text-gray-500'}`}>
                              {isCopied ? t('admin.codeCopied') : t('admin.codeInstructions')}
                            </p>
                        </div>
                    </div>
                );
            })}
          </div>
        )}

        {/* --- USERS SECTION --- */}
        <div className="mb-16">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
              <User className="text-teal-400 h-5 w-5 md:h-6 md:w-6" /> {t('admin.manageClients')}
            </h2>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder={t('admin.searchClient')}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-12 text-white focus:outline-none focus:border-teal-400"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="glass-panel rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-800 text-gray-400 uppercase text-xs font-bold tracking-wider">
                  <tr>
                    <th className="px-3 md:px-6 py-3 md:py-4">{t('admin.identity')}</th>
                    <th className="px-3 md:px-6 py-3 md:py-4">{t('admin.balance')}</th>
                    <th className="hidden md:table-cell px-6 py-4">{t('admin.card')}</th>
                    <th className="px-3 md:px-6 py-3 md:py-4 text-center">{t('admin.operations')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {filteredUsers.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">{t('admin.noUsers')}</td></tr>
                  ) : (
                    filteredUsers.map(user => (
                      <tr key={user.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="px-3 md:px-6 py-3 md:py-4">
                          <div className="flex items-center gap-2 md:gap-3">
                            <img src={user.avatarUrl} alt="" className="h-6 w-6 md:h-8 md:w-8 rounded-full" />
                            <div>
                              <div className="text-white font-medium text-sm md:text-base">{user.name}</div>
                              <div className="text-gray-500 text-xs">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 md:px-6 py-3 md:py-4 font-mono text-teal-300 font-bold text-xs md:text-sm">
                          {(() => {
                            const balance = typeof user.balance === 'string' 
                              ? parseFloat(user.balance) || 0 
                              : (user.balance || 0);
                            return balance.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) + ' ' + CURRENCY;
                          })()}
                        </td>
                        <td className="hidden md:table-cell px-6 py-4 text-gray-400 font-mono text-xs">
                          {user.cardNumber}
                        </td>
                        <td className="px-3 md:px-6 py-3 md:py-4">
                          <div className="flex justify-center gap-1 md:gap-2">
                             <button
                                onClick={() => openUserDetails(user)}
                                className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-all"
                                title={t('admin.viewDetails')}
                            >
                                <Info className="h-4 w-4 md:h-5 md:w-5" />
                            </button>
                            <button 
                              onClick={() => openTransactionModal(user, 'CREDIT')} 
                              className="p-1.5 md:p-2 bg-teal-400/20 text-teal-300 rounded-lg hover:bg-teal-400 hover:text-white transition-all"
                              title={t('admin.credit')}
                            >
                              <PlusCircle className="h-4 w-4 md:h-5 md:w-5" />
                            </button>
                            <button 
                              onClick={() => openTransactionModal(user, 'DEBIT')} 
                              className="p-1.5 md:p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                              title={t('admin.debit')}
                            >
                              <MinusCircle className="h-4 w-4 md:h-5 md:w-5" />
                            </button>
                            <div className="hidden md:block w-px h-6 bg-slate-700 mx-2 self-center"></div>
                            <button
                                onClick={() => openDeleteModal(user)}
                                className="p-1.5 md:p-2 bg-slate-700 text-gray-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                                title={t('admin.delete')}
                            >
                                <Trash2 className="h-4 w-4 md:h-5 md:w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* --- TRANSACTIONS MONITOR SECTION --- */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-6">
            <Activity className="text-teal-400" /> {t('admin.transactionMonitor')}
          </h2>

          {/* Filters Bar */}
          <div className="glass-panel p-6 rounded-2xl mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              
              {/* Date Filters */}
              <div>
                <label className="text-xs text-gray-400 block mb-1">{t('admin.dateFrom')}</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <input type="date" className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-10 text-white text-sm focus:border-teal-400 outline-none" 
                    value={dateStart} onChange={e => setDateStart(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">{t('admin.dateTo')}</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <input type="date" className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-10 text-white text-sm focus:border-teal-400 outline-none" 
                    value={dateEnd} onChange={e => setDateEnd(e.target.value)} />
                </div>
              </div>

              {/* Amount Filters */}
              <div>
                <label className="text-xs text-gray-400 block mb-1">{t('admin.amountMin')}</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <input type="number" placeholder="0" className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-10 text-white text-sm focus:border-teal-400 outline-none" 
                    value={minAmount} onChange={e => setMinAmount(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">{t('admin.amountMax')}</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <input type="number" placeholder="Max" className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-10 text-white text-sm focus:border-teal-400 outline-none" 
                    value={maxAmount} onChange={e => setMaxAmount(e.target.value)} />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="text-xs text-gray-400 block mb-1">{t('admin.status')}</label>
                <div className="relative">
                  <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <select 
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-10 text-white text-sm focus:border-teal-400 outline-none appearance-none"
                    value={statusFilter}
                    onChange={(e: any) => setStatusFilter(e.target.value)}
                  >
                    <option value="ALL">{t('admin.status.all')}</option>
                    <option value="COMPLETED">{t('admin.status.completed')}</option>
                    <option value="PENDING">{t('admin.status.pending')}</option>
                    <option value="FAILED">{t('admin.status.failed')}</option>
                  </select>
                </div>
              </div>

            </div>
          </div>

          {/* Transactions Table */}
          <div className="glass-panel rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-800 text-gray-400 uppercase text-xs font-bold tracking-wider">
                  <tr>
                    <th className="px-3 md:px-6 py-3 md:py-4">{t('admin.date')}</th>
                    <th className="px-3 md:px-6 py-3 md:py-4">{t('admin.clientName')}</th>
                    <th className="px-3 md:px-6 py-3 md:py-4">{t('admin.description')}</th>
                    <th className="px-3 md:px-6 py-3 md:py-4">{t('admin.amount')}</th>
                    <th className="px-3 md:px-6 py-3 md:py-4">{t('admin.status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {filteredTransactions.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">{t('admin.noTransactions')}</td></tr>
                  ) : (
                    filteredTransactions.map((transaction) => {
                      const isCredit = transaction.type === 'CREDIT';
                      const clientName = users.find(u => u.id === transaction.userId)?.name || t('admin.unknownClient');
                      return (
                      <tr key={transaction.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="px-3 md:px-6 py-3 md:py-4 text-gray-300 text-xs md:text-sm whitespace-nowrap">
                          <span className="hidden sm:inline">{new Date(transaction.date).toLocaleString('fr-FR')}</span>
                          <span className="sm:hidden">{new Date(transaction.date).toLocaleString('fr-FR', { 
                            day: '2-digit', 
                            month: '2-digit', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}</span>
                        </td>
                        <td className="px-3 md:px-6 py-3 md:py-4 text-white text-xs md:text-sm font-medium">
                          {clientName}
                        </td>
                        <td className="px-3 md:px-6 py-3 md:py-4 text-white text-xs md:text-sm">
                           <div className="flex items-center gap-2">
                             <div className={`p-1 rounded bg-opacity-20 shrink-0 ${isCredit ? 'bg-teal-400 text-teal-300' : 'bg-red-500 text-red-400'}`}>
                               {isCredit ? <ArrowDownLeft className="h-3 w-3 md:h-4 md:w-4" /> : <ArrowUpRight className="h-3 w-3 md:h-4 md:w-4" />}
                             </div>
                             <div className="min-w-0">
                               <div className="truncate">{transaction.recipientName}</div>
                               <div className="text-xs text-gray-500 truncate">{transaction.recipientBank}</div>
                             </div>
                           </div>
                        </td>
                        <td className={`px-3 md:px-6 py-3 md:py-4 font-mono font-bold text-xs md:text-sm whitespace-nowrap ${isCredit ? 'text-teal-300' : 'text-white'}`}>
                          {isCredit ? '+' : '-'} {transaction.amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} {CURRENCY}
                        </td>
                        <td className="px-3 md:px-6 py-3 md:py-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold uppercase whitespace-nowrap ${
                            transaction.status === 'COMPLETED' ? 'bg-teal-400/20 text-teal-300' :
                            transaction.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {transaction.status === 'COMPLETED' ? t('admin.status.completed') : transaction.status === 'PENDING' ? t('admin.status.pending') : t('admin.status.failed')}
                          </span>
                        </td>
                      </tr>
                    )})
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* --- AUDIT LOGS SECTION --- */}
        <div>
           <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2 mb-6">
              <ClipboardList className="text-gray-400 h-5 w-5 md:h-6 md:w-6" /> {t('admin.auditLog')}
           </h2>
           <div className="glass-panel rounded-2xl shadow-xl overflow-hidden">
             <div className="max-h-[400px] overflow-auto custom-scrollbar">
                <table className="w-full text-left min-w-[900px]">
                    <thead className="bg-slate-800/80 sticky top-0 backdrop-blur text-gray-400 uppercase text-xs font-bold tracking-wider z-10">
                        <tr>
                            <th className="px-6 py-3 whitespace-nowrap">{t('admin.date')}</th>
                            <th className="px-6 py-3 whitespace-nowrap">{t('admin.administrator')}</th>
                            <th className="px-6 py-3 whitespace-nowrap">{t('admin.action')}</th>
                            <th className="px-6 py-3 min-w-[200px]">{t('admin.details')}</th>
                            <th className="px-6 py-3 whitespace-nowrap">{t('admin.target')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {adminLogs.length === 0 ? (
                            <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500 italic">{t('admin.noLogs')}</td></tr>
                        ) : (
                            adminLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-3 text-gray-400 text-xs font-mono">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-3 text-white text-sm font-bold">
                                        {log.adminName}
                                    </td>
                                    <td className="px-6 py-3">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                            log.actionType === 'BALANCE_UPDATE' ? 'bg-teal-400/20 text-teal-300' : 
                                            log.actionType === 'USER_DELETION' ? 'bg-red-500/20 text-red-400' :
                                            'bg-gray-500/20 text-gray-400'
                                        }`}>
                                            {log.actionType === 'BALANCE_UPDATE' ? t('admin.balanceUpdate') : 
                                             log.actionType === 'USER_DELETION' ? t('admin.userDeletion') : t('admin.system')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-gray-300 text-sm">
                                        {log.description}
                                    </td>
                                    <td className="px-6 py-3 text-teal-300 text-sm">
                                        {log.targetUserName}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
             </div>
           </div>
        </div>

        {/* Transaction Modal */}
        {transModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in-up">
            <div className="glass-panel w-full max-w-md rounded-2xl p-6 relative border border-white/10 shadow-2xl">
              <button 
                onClick={closeTransactionModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
              
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                {transModal.type === 'CREDIT' ? (
                  <PlusCircle className="text-teal-300" />
                ) : (
                  <MinusCircle className="text-red-400" />
                )}
                {transModal.type === 'CREDIT' ? t('admin.creditAccount') : t('admin.debitAccount')}
              </h2>
              <p className="text-gray-400 text-sm mb-6">
                {t('admin.client')} <span className="text-white font-bold">{transModal.userName}</span><br/>
                {t('admin.currentBalance')} <span className="font-mono text-teal-300">{transModal.currentBalance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} {CURRENCY}</span>
              </p>

              <form onSubmit={handleConfirmTransaction} className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">{t('admin.amount')} ({CURRENCY})</label>
                  <input
                    type="number"
                    autoFocus
                    required
                    min="0.01"
                    step="0.01"
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:border-teal-400 outline-none transition-all font-mono text-lg"
                    value={amountInput}
                    onChange={e => setAmountInput(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                
                {transModal.type === 'DEBIT' && parseFloat(amountInput || '0') > transModal.currentBalance && (
                  <div className="text-yellow-500 text-xs flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> {t('admin.debitWarning')}
                  </div>
                )}

                {transactionError && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{transactionError}</span>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={isProcessingTransaction}
                  className={`w-full py-3 rounded-lg font-bold text-white transition-all shadow-lg ${
                    isProcessingTransaction
                      ? 'bg-gray-600 cursor-not-allowed opacity-50'
                      : transModal.type === 'CREDIT' 
                        ? 'bg-teal-400 hover:bg-teal-500 shadow-teal-400/20' 
                        : 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
                  }`}
                >
                  {isProcessingTransaction 
                    ? t('admin.processing') 
                    : transModal.type === 'CREDIT' ? t('admin.confirmCredit') : t('admin.confirmDebit')
                  }
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in-up">
            <div className="glass-panel w-full max-w-md rounded-2xl p-6 relative border border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
              <button 
                onClick={closeDeleteModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
              
              <div className="flex flex-col items-center text-center">
                 <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                     <AlertTriangle className="h-8 w-8 text-red-500" />
                 </div>
                 <h2 className="text-xl font-bold text-white mb-2">{t('admin.deleteClient')}</h2>
                 <p className="text-gray-400 text-sm mb-6">
                    {t('admin.deleteWarning')} <span className="font-bold text-white">{deleteModal.userName}</span> {t('admin.willBeDeleted')}
                 </p>

                 {deleteError && (
                   <div className="w-full mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                     <p className="text-red-400 text-sm">{deleteError}</p>
                   </div>
                 )}

                 <div className="flex gap-4 w-full">
                     <button 
                        onClick={closeDeleteModal}
                        disabled={isDeleting}
                        className="flex-1 py-3 rounded-lg font-medium text-white bg-slate-800 hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                        {t('common.cancel')}
                     </button>
                     <button 
                        onClick={handleConfirmDelete}
                        disabled={isDeleting}
                        className="flex-1 py-3 rounded-lg font-bold text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                     >
                        {isDeleting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            {t('common.loading') || 'Suppression...'}
                          </>
                        ) : (
                          t('common.delete')
                        )}
                     </button>
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* User Details Modal */}
        {userDetailsModal.isOpen && userDetailsModal.user && (
           <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in-up">
              <div className="glass-panel w-full max-w-2xl rounded-3xl p-0 relative border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar">
                  
                  {/* Header Background */}
                  <div className="h-32 bg-gradient-to-r from-slate-800 to-slate-900 relative">
                      <button 
                          onClick={closeUserDetails}
                          className="absolute top-4 right-4 z-10 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-md transition-all"
                      >
                          <X className="h-5 w-5" />
                      </button>
                  </div>

                  {/* Content */}
                  <div className="px-8 pb-8 -mt-16 relative">
                      {/* Avatar & Flag */}
                      <div className="flex justify-between items-end mb-6">
                          <div className="relative">
                              <img 
                                src={userDetailsModal.user.avatarUrl} 
                                alt="Avatar" 
                                className="w-32 h-32 rounded-full border-4 border-slate-900 shadow-xl bg-slate-800 object-cover" 
                              />
                              {userDetailsModal.user.country && (
                                  <div className="absolute bottom-1 right-1 text-2xl bg-slate-900 rounded-full w-10 h-10 flex items-center justify-center border-2 border-slate-800 shadow-lg" title={userDetailsModal.user.country.name}>
                                      {userDetailsModal.user.country.flag}
                                  </div>
                              )}
                          </div>
                          <div className="mb-2">
                             <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${
                                 userDetailsModal.user.accountType === 'SAVINGS' 
                                 ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/50' 
                                 : 'bg-teal-400/10 text-teal-400 border-teal-400/50'
                             }`}>
                                 {userDetailsModal.user.accountType === 'SAVINGS' ? t('admin.accountSavings') : t('admin.accountCurrent')}
                             </div>
                          </div>
                      </div>

                      <div className="space-y-8">
                          {/* Identity Section */}
                          <div>
                              <h2 className="text-3xl font-bold text-white mb-1">{userDetailsModal.user.name}</h2>
                              <p className="text-gray-400 flex items-center gap-2 mb-6">
                                  ID: <span className="font-mono text-xs bg-slate-800 px-2 py-0.5 rounded text-gray-300">{userDetailsModal.user.id}</span>
                              </p>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-colors">
                                      <div className="flex items-center gap-3 mb-2">
                                          <div className="p-2 bg-teal-400/10 rounded-lg text-teal-300">
                                              <Mail className="h-4 w-4" />
                                          </div>
                                          <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">{t('admin.email')}</span>
                                      </div>
                                      <div className="text-white font-medium pl-1">{userDetailsModal.user.email}</div>
                                  </div>

                                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-colors">
                                      <div className="flex items-center gap-3 mb-2">
                                          <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                                              <Phone className="h-4 w-4" />
                                          </div>
                                          <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">{t('admin.phone')}</span>
                                      </div>
                                      <div className="text-white font-medium pl-1">{userDetailsModal.user.phone || t('common.notProvided')}</div>
                                  </div>

                                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-colors">
                                      <div className="flex items-center gap-3 mb-2">
                                          <div className="p-2 bg-pink-500/10 rounded-lg text-pink-400">
                                              <Calendar className="h-4 w-4" />
                                          </div>
                                          <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">{t('admin.birthDate')}</span>
                                      </div>
                                      <div className="text-white font-medium pl-1">{userDetailsModal.user.birthDate || t('common.notProvided')}</div>
                                  </div>

                                   <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-colors">
                                      <div className="flex items-center gap-3 mb-2">
                                          <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400">
                                              <MapPin className="h-4 w-4" />
                                          </div>
                                          <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">{t('admin.address')}</span>
                                      </div>
                                      <div className="text-white font-medium pl-1 truncate" title={`${userDetailsModal.user.address}, ${userDetailsModal.user.postalCode} ${userDetailsModal.user.country?.name}`}>
                                          {userDetailsModal.user.address}, <br/>
                                          {userDetailsModal.user.postalCode} {userDetailsModal.user.country?.name}
                                      </div>
                                  </div>
                              </div>
                          </div>

                          {/* Financial Section */}
                          <div>
                              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                  <CreditCard className="text-teal-400 h-5 w-5" /> {t('admin.bankInfo')}
                              </h3>
                              <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                      <div>
                                          <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">{t('admin.currentBalance')}</div>
                                          <div className="text-3xl font-mono font-bold text-white mb-4">
                                              {userDetailsModal.user.balance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} <span className="text-teal-400">{CURRENCY}</span>
                                          </div>
                                          <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">{t('admin.memberSince')}</div>
                                          <div className="text-white">
                                              {new Date(userDetailsModal.user.joinedDate).toLocaleDateString()}
                                          </div>
                                      </div>
                                      
                                      <div className="space-y-4">
                                          <div>
                                              <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">{t('admin.cardNumber')}</div>
                                              <div className="font-mono text-white text-lg tracking-widest">{userDetailsModal.user.cardNumber}</div>
                                          </div>
                                          <div className="flex gap-8">
                                              <div>
                                                  <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">{t('admin.expires')}</div>
                                                  <div className="font-mono text-white">{userDetailsModal.user.cardExpiry}</div>
                                              </div>
                                              <div>
                                                  <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">{t('admin.cvc')}</div>
                                                  <div className="font-mono text-white">{userDetailsModal.user.cardCVC}</div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>

                  </div>
              </div>
           </div>
        )}

        {/* Admin Settings Modal */}
        {showAdminSettingsModal && currentUser && (
          <AdminSettingsModal 
            onClose={() => setShowAdminSettingsModal(false)} 
            currentUser={currentUser}
          />
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;