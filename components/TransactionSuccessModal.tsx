import React from 'react';
import { useBank } from '../context/BankContext';
import { CheckCircle, Sparkles, X } from 'lucide-react';

const TransactionSuccessModal: React.FC = () => {
  const { closeTransactionSuccessModal, lastCompletedTransaction, t } = useBank();

  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in-up"
      onClick={closeTransactionSuccessModal}
    >
      <div 
        className="glass-panel w-full max-w-md rounded-2xl p-8 relative border border-white/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeTransactionSuccessModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="flex flex-col items-center text-center space-y-6">
          {/* Success Icon with Animation */}
          <div className="relative">
            <div className="w-20 h-20 bg-teal-400/20 rounded-full flex items-center justify-center mb-2 animate-pulse">
              <CheckCircle className="h-12 w-12 text-teal-400" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="h-6 w-6 text-yellow-400 animate-bounce" />
            </div>
          </div>
          
          {/* Title */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">{t('transactionSuccessModal.title')}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t('transactionSuccessModal.message')}
            </p>
          </div>

          {/* Transaction Details */}
          {lastCompletedTransaction && lastCompletedTransaction.amount && lastCompletedTransaction.recipientName && (
            <div className="w-full bg-slate-800/50 rounded-xl p-4 space-y-2 border border-slate-700">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">{t('transactionSuccessModal.amount')}</span>
                <span className="text-white font-bold text-lg">{formatAmount(lastCompletedTransaction.amount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">{t('transactionSuccessModal.recipient')}</span>
                <span className="text-white font-medium">{lastCompletedTransaction.recipientName}</span>
              </div>
            </div>
          )}

          {/* Continue Button */}
          <button
            onClick={closeTransactionSuccessModal}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold hover:from-teal-500 hover:to-teal-600 transition-all shadow-lg shadow-teal-400/30 transform hover:scale-105 duration-200"
          >
            {t('transactionSuccessModal.continue')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionSuccessModal;

