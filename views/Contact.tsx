import React, { useState } from 'react';
import Footer from '../components/Footer';
import { MapPin, Mail, Phone, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useBank } from '../context/BankContext';

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

const Contact: React.FC = () => {
  const { t } = useBank();
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setSubmitStatus('success');
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        message: ''
      });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);

    } catch (error: any) {
      console.error('Error sending contact form:', error);
      setSubmitStatus('error');
      setErrorMessage(error.message || t('contact.error.generic'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof ContactFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    // Clear error when user starts typing
    if (submitStatus === 'error') {
      setSubmitStatus('idle');
      setErrorMessage('');
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen pt-20">
      <div className="py-16 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">{t('contact.title')}</h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
           {t('contact.subtitle')}
        </p>
      </div>

      <section className="py-12 px-4 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-12">
            <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-full bg-teal-400/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-8 w-8 text-teal-300" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl mb-2">{t('contact.headquarters')}</h3>
                  <p className="text-gray-400 text-lg whitespace-pre-line">{t('contact.address')}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-full bg-teal-400/10 flex items-center justify-center shrink-0">
                  <Mail className="h-8 w-8 text-teal-300" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl mb-2">{t('contact.email')}</h3>
                  <p className="text-gray-400 text-lg whitespace-pre-line">{t('contact.emailAddresses')}</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-full bg-teal-400/10 flex items-center justify-center shrink-0">
                  <Phone className="h-8 w-8 text-teal-300" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl mb-2">{t('contact.phone')}</h3>
                  <p className="text-gray-400 text-lg whitespace-pre-line">{t('contact.phoneNumber')}</p>
                </div>
              </div>
          </div>

          <div className="glass-panel p-8 rounded-2xl shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">{t('contact.sendMessage')}</h2>
            
            {/* Success Message */}
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-teal-400/10 border border-teal-400/30 rounded-lg flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-teal-300 shrink-0" />
                <p className="text-teal-300">{t('contact.messageSent')}</p>
              </div>
            )}

            {/* Error Message */}
            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
                <p className="text-red-400">{errorMessage || t('contact.error.generic')}</p>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">{t('contact.lastName')}</label>
                  <input 
                    type="text" 
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-teal-400 outline-none transition-colors" 
                    placeholder={t('contact.lastNamePlaceholder')}
                    value={formData.lastName}
                    onChange={handleChange('lastName')}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">{t('contact.firstName')}</label>
                  <input 
                    type="text" 
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-teal-400 outline-none transition-colors" 
                    placeholder={t('contact.firstNamePlaceholder')}
                    value={formData.firstName}
                    onChange={handleChange('firstName')}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">{t('contact.email')}</label>
                <input 
                  type="email" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-teal-400 outline-none transition-colors" 
                  placeholder={t('contact.emailPlaceholder')}
                  value={formData.email}
                  onChange={handleChange('email')}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">{t('contact.message')}</label>
                <textarea 
                  rows={4} 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-teal-400 outline-none transition-colors resize-none" 
                  placeholder={t('contact.messagePlaceholder')}
                  value={formData.message}
                  onChange={handleChange('message')}
                  required
                  disabled={isSubmitting}
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-teal-400 hover:bg-teal-500 disabled:bg-teal-400/50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-teal-400/20 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {t('contact.sending')}
                  </>
                ) : (
                  t('contact.sendButton')
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
