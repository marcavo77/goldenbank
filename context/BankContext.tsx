
import React, { createContext, useContext, useState, ReactNode, useEffect, useRef, useCallback, useMemo } from 'react';
import { User, Transaction, ActiveTransfer, ViewState, AdminLog, Country, AccountType, Message, AdminChatSettings, MarketState, MarketStock, LanguageCode } from '../types';
import { generateCardNumber, generateCVC, generateExpiry, generateSecurityCode } from '../services/bankService';
import { CURRENCY, COMPETITORS, FAILING_BANKS } from '../constants';
import { TRANSLATIONS } from '../translations';
import { 
  authService, 
  userService, 
  transactionService, 
  messageService, 
  adminLogService, 
  activeTransferService,
  storageService,
  adminChatSettingsService
} from '../services/supabaseService';
import { supabase } from '../lib/supabase';
import { getViewFromURL, navigateTo, isProtectedRoute } from '../utils/routing';

// Interface for Registration Data
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  birthDate: string;
  phone: string;
  address: string;
  postalCode: string;
  country: Country;
  accountType: AccountType;
  avatarUrl?: string;
}

interface BankContextType {
  currentUser: User | null;
  users: User[];
  transactions: Transaction[];
  adminLogs: AdminLog[];
  activeTransfer: ActiveTransfer;
  allActiveTransfers: Record<string, ActiveTransfer>;
  view: ViewState;
  
  // Market Data (Persistent)
  marketState: MarketState;

  // Language
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;

  // Chat State
  messages: Message[];
  isChatOpen: boolean;
  toggleChat: () => void;
  sendMessage: (content: string, receiverId?: string) => void;
  markAsRead: (senderId: string) => void;
  getUnreadCount: () => number;
  
  // Advanced Chat Features
  typingUsers: Record<string, boolean>;
  setTyping: (userId: string, isTyping: boolean) => void;
  onlineUsers: Record<string, boolean>;
  adminChatSettings: AdminChatSettings;
  updateAdminChatSettings: (settings: Partial<AdminChatSettings>) => Promise<void>;
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  setView: (view: ViewState) => void;
  reloadUserData: () => Promise<void>;
  
  // Logout Modal Control
  isLogoutModalOpen: boolean;
  openLogoutModal: () => void;
  closeLogoutModal: () => void;
  
  // Success Modal Control
  isSuccessModalOpen: boolean;
  openSuccessModal: () => void;
  closeSuccessModal: () => void;
  
  // App Download Modal Control
  isAppDownloadModalOpen: boolean;
  openAppDownloadModal: () => void;
  closeAppDownloadModal: () => void;
  
  // Transaction Success Modal Control
  isTransactionSuccessModalOpen: boolean;
  openTransactionSuccessModal: () => void;
  closeTransactionSuccessModal: () => void;
  lastCompletedTransaction: { amount: number; recipientName: string } | null;
  
  // Admin Actions
  updateUserBalance: (userId: string, amount: number) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  
  // User Profile Actions
  updateUserProfile: (userId: string, updates: Partial<User>) => Promise<void>;
  
  // Transfer Logic
  startTransfer: (amount: number, recipientName: string) => Promise<boolean>;
  submitSecurityCode: (code: string) => Promise<boolean>;
  getActiveCodeForAdmin: (userId: string) => string | null;
  resetActiveTransfer: () => void;
  
  // Loading states
  isLoading: boolean;
}

const BankContext = createContext<BankContextType | undefined>(undefined);

const DEFAULT_EMPTY_TRANSFER: ActiveTransfer = {
  isActive: false,
  progress: 0,
  isPaused: false,
  requiredCode: null,
  recipientName: '',
  amount: 0,
  currentStepDescription: '',
  completed: false
};

export const BankProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize view from URL on mount
  const [view, setViewState] = useState<ViewState>(() => {
    if (typeof window !== 'undefined') {
      return getViewFromURL();
    }
    return 'LANDING';
  });
  
  // Wrapper function to update both state and URL
  const setView = useCallback((newView: ViewState, replace: boolean = false) => {
    setViewState(newView);
    navigateTo(newView, replace);
  }, []);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [adminLogs, setAdminLogs] = useState<AdminLog[]>([]);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isAppDownloadModalOpen, setIsAppDownloadModalOpen] = useState(false);
  const [isTransactionSuccessModalOpen, setIsTransactionSuccessModalOpen] = useState(false);
  const [lastCompletedTransaction, setLastCompletedTransaction] = useState<{ amount: number; recipientName: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Language State with Persistence - Italian is the default language
  const [language, setLanguage] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('nova_lang');
    if (saved === 'fr' || saved === 'pt') {
      localStorage.setItem('nova_lang', 'it');
      return 'it';
    }
    return (saved as LanguageCode) || 'it';
  });

  // Force Italian on mount if localStorage had old default
  useEffect(() => {
    const saved = localStorage.getItem('nova_lang');
    if (saved === 'fr' || saved === 'pt' || !saved) {
      setLanguage('it');
      localStorage.setItem('nova_lang', 'it');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('nova_lang', language);
  }, [language]);

  // Translation Function - Memoized to ensure components re-render when language changes
  const t = useMemo(() => {
    return (key: string): string => {
      const langTrans = TRANSLATIONS[language];
      if (!langTrans) return key;
      
      const text = langTrans[key];
      if (text) return text;

      // Fallback to Italian (default language) if translation not found
      if (language !== 'it' && TRANSLATIONS['it'][key]) {
        return TRANSLATIONS['it'][key];
      }
      
      return key;
    };
  }, [language]);

  // Chat State
  const [messages, setMessages] = useState<Message[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Advanced Chat State
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
  const [onlineUsers, setOnlineUsers] = useState<Record<string, boolean>>({});
  const [adminChatSettings, setAdminChatSettings] = useState<AdminChatSettings>({
    showReadReceiptsToUser: true,
    showTypingToUser: true,
    showOnlineStatusToUser: true
  });
  
  // Realtime channel refs for cleanup
  const presenceChannelRef = useRef<any>(null);
  const typingChannelRef = useRef<any>(null);
  const heartbeatIntervalRef = useRef<any>(null);
  
  // Registry of active transfers
  const [allTransfers, setAllTransfers] = useState<Record<string, ActiveTransfer>>({});
  const allTransfersRef = useRef<Record<string, ActiveTransfer>>({});
  const transactionProcessedRef = useRef<Record<string, boolean>>({});

  // Market Simulation State (client-side only)
  const [novaPrice, setNovaPrice] = useState(1245.50);
  const [novaHistory, setNovaHistory] = useState<number[]>(Array(40).fill(1245.50));
  const [failingBank] = useState(() => FAILING_BANKS[Math.floor(Math.random() * FAILING_BANKS.length)]);
  const [competitorPrice, setCompetitorPrice] = useState(failingBank.price);
  const [competitorHistory, setCompetitorHistory] = useState<number[]>(Array(40).fill(failingBank.price));
  const [marketData, setMarketData] = useState<MarketStock[]>(COMPETITORS.map(c => ({
    ...c,
    change: 0,
    trend: 'neutral'
  })));

  // Initialize: Check auth state and load data
  useEffect(() => {
    const initializeApp = async () => {
      setIsLoading(true);
      try {
        // Check if user is already logged in
        const session = await authService.getSession();
        if (session?.user) {
          const user = await userService.getUserById(session.user.id);
          if (user) {
            setCurrentUser(user);
            // Only redirect if not already on a protected page
            const currentView = getViewFromURL();
            if (!isProtectedRoute(currentView)) {
              setView(user.role === 'ADMIN' ? 'ADMIN' : 'DASHBOARD', true);
            } else {
              // User is already on a protected page - just sync URL
              const targetView = user.role === 'ADMIN' ? 'ADMIN' : 'DASHBOARD';
              if (currentView !== targetView) {
                setView(targetView, true);
              }
            }
            
            // If admin, load everything in parallel for efficiency
            if (user.role === 'ADMIN') {
              const [allUsers, allTransactions, logs, allTransfersData, chatSettings] = await Promise.all([
                userService.getAllUsers(),
                transactionService.getAllTransactions(),
                adminLogService.getAllLogs(),
                activeTransferService.getAllActiveTransfers(),
                adminChatSettingsService.getChatSettings(user.id)
              ]);
              
              // Ensure balances are properly converted to numbers
              // IMPORTANT: Create completely new objects to force React to detect changes
              const usersWithBalances = allUsers.map(u => ({
                ...u,
                id: u.id, // Explicitly include all fields
                name: u.name,
                email: u.email,
                role: u.role,
                balance: typeof u.balance === 'string' ? parseFloat(u.balance) || 0 : (u.balance || 0),
                avatarUrl: u.avatarUrl,
                accountType: u.accountType,
                cardNumber: u.cardNumber,
                cardExpiry: u.cardExpiry,
                cardCVC: u.cardCVC,
                joinedDate: u.joinedDate,
                birthDate: u.birthDate,
                phone: u.phone,
                address: u.address,
                postalCode: u.postalCode,
                country: u.country ? { ...u.country } : undefined
              }));
              
              // Create a completely new array reference
              const newUsersArray = [...usersWithBalances];
              
              // Set all admin data at once to avoid race conditions
              setUsers(newUsersArray);
              setTransactions(allTransactions);
              setAdminLogs(logs);
              setAllTransfers(allTransfersData);
              
              // Load chat settings for admin
              if (chatSettings) {
                setAdminChatSettings(chatSettings);
              } else {
                // Create default settings if none exist
                const defaultSettings = { showReadReceiptsToUser: true, showTypingToUser: true, showOnlineStatusToUser: true };
                setAdminChatSettings(defaultSettings);
                await adminChatSettingsService.updateChatSettings(user.id, defaultSettings);
              }
              
              // Load messages for admin
              const userMessages = await messageService.getMessages(user.id);
              setMessages(userMessages);
              
              const totalEncours = newUsersArray.filter(u => u.role === 'USER').reduce((sum, u) => sum + (u.balance || 0), 0);
              console.log(`✅ Admin initialized: ${newUsersArray.length} users, ${allTransactions.length} transactions, total encours: ${totalEncours}`);
            } else {
              // For regular users, load users list first, then user-specific data
              const allUsers = await userService.getAllUsers();
              const usersWithBalances = allUsers.map(u => ({
                ...u,
                balance: typeof u.balance === 'string' ? parseFloat(u.balance) || 0 : (u.balance || 0)
              }));
              setUsers(usersWithBalances);
              
              // Load admin chat settings for regular users too (so they can respect the settings)
              const chatSettings = await adminChatSettingsService.getChatSettings();
              if (chatSettings) {
                setAdminChatSettings(chatSettings);
              } else {
                // Default settings if none exist
                const defaultSettings = { showReadReceiptsToUser: true, showTypingToUser: true };
                setAdminChatSettings(defaultSettings);
              }
              
              // Load user-specific data (this won't overwrite users list now)
              await loadUserData(user.id);
            }
          }
        } else {
          // No session, but still load users for landing page (if needed)
          const allUsers = await userService.getAllUsers();
          const usersWithBalances = allUsers.map(u => ({
            ...u,
            balance: typeof u.balance === 'string' ? parseFloat(u.balance) || 0 : (u.balance || 0)
          }));
          setUsers(usersWithBalances);
        }
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();

    // Listen for auth state changes
    const { data: { subscription } } = authService.onAuthStateChange(async (user) => {
      if (user) {
        const userData = await userService.getUserById(user.id);
        if (userData) {
          setCurrentUser(userData);
          await loadUserData(user.id);
        }
      } else {
        setCurrentUser(null);
        setMessages([]);
        setTransactions([]);
        setAllTransfers({});
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sync view with URL on mount and navigation
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const syncViewWithURL = () => {
      const urlView = getViewFromURL();
      setViewState(prevView => {
        if (prevView !== urlView) {
          return urlView;
        }
        return prevView;
      });
    };

    // Sync immediately
    syncViewWithURL();

    // Listen for browser navigation (back/forward buttons)
    const handlePopState = () => {
      syncViewWithURL();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Handle route protection - redirect to login if accessing protected route without auth
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const currentView = getViewFromURL();
    
    if (isProtectedRoute(currentView) && !currentUser) {
      // User is trying to access protected route but not logged in
      setView('LOGIN', true);
    } else if (currentUser && isProtectedRoute(currentView)) {
      // User is logged in and on protected route - verify access
      if (currentView === 'ADMIN' && currentUser.role !== 'ADMIN') {
        setView('DASHBOARD', true);
      } else if (currentView === 'DASHBOARD' && currentUser.role === 'ADMIN') {
        setView('ADMIN', true);
      }
    }
  }, [currentUser, view]);

  // Load user-specific data (does NOT overwrite users list, only updates individual user)
  const loadUserData = async (userId: string) => {
    try {
      // Reload user from database to get latest balance
      const freshUser = await userService.getUserById(userId);
      if (freshUser) {
        const freshBalance = typeof freshUser.balance === 'string' 
          ? parseFloat(freshUser.balance) 
          : freshUser.balance;
        
        // Check if this user is admin - if so, don't load user-specific transactions
        const isAdmin = freshUser.role === 'ADMIN';
        
        // Always update current user if it matches
        if (currentUser && currentUser.id === userId) {
          setCurrentUser(freshUser);
        }
        
        // Update ONLY this user in the users list, don't replace the whole list
        // Ensure balance is properly converted
        const freshUserWithBalance = {
          ...freshUser,
          balance: typeof freshUser.balance === 'string' ? parseFloat(freshUser.balance) || 0 : (freshUser.balance || 0)
        };
        
        setUsers(prev => {
          const existingIndex = prev.findIndex(u => u.id === userId);
          if (existingIndex >= 0) {
            // Update existing user in place
            const updated = [...prev];
            updated[existingIndex] = freshUserWithBalance;
            return updated;
          }
          // If user not in list, add it (shouldn't happen normally)
          return [...prev, freshUserWithBalance];
        });
        
        // Only load user-specific transactions if not admin
        // Admin transactions are loaded separately with getAllTransactions
        if (!isAdmin) {
          const [userTransactions, userMessages] = await Promise.all([
            transactionService.getTransactionsByUserId(userId),
            messageService.getMessages(userId)
          ]);
          
          setTransactions(userTransactions);
          setMessages(userMessages);
        } else {
          // For admin, only load messages, not transactions (transactions loaded separately)
          const userMessages = await messageService.getMessages(userId);
          setMessages(userMessages);
        }
      }
      
      // Load active transfer - but skip if it's already completed
      const activeTransfer = await activeTransferService.getActiveTransfer(userId);
      if (activeTransfer) {
        // Only load transfer if it's not completed
        // Completed transfers should be cleaned up and not reloaded
        if (!activeTransfer.completed) {
          setAllTransfers(prev => ({
            ...prev,
            [userId]: activeTransfer
          }));
        } else {
          // Clean up completed transfers immediately
          console.log(`Cleaning up completed transfer for user ${userId}`);
          await activeTransferService.deleteActiveTransfer(userId);
          // Remove from state
          setAllTransfers(prev => {
            const updated = { ...prev };
            delete updated[userId];
            return updated;
          });
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  // Track last reload to prevent infinite loops
  const lastReloadRef = useRef<{ view: ViewState; userId: string; timestamp: number } | null>(null);

  // Reload user data function (can be called externally to refresh data)
  // Use refs to avoid dependencies that cause re-renders
  const reloadUserData = useCallback(async () => {
    const user = currentUser;
    const currentView = view;
    if (!user) return;
    
    // Prevent reload if already reloaded recently for this view and user (within 2 seconds)
    const now = Date.now();
    if (lastReloadRef.current && 
        lastReloadRef.current.view === currentView && 
        lastReloadRef.current.userId === user.id &&
        (now - lastReloadRef.current.timestamp) < 2000) {
      return;
    }
    
    lastReloadRef.current = { view: currentView, userId: user.id, timestamp: now };
    
    await loadUserData(user.id);
    
    // If admin, also reload all admin data
    if (user.role === 'ADMIN') {
      const [allUsersFromDb, logs, allTransfers, allTransactions] = await Promise.all([
        userService.getAllUsers(),
        adminLogService.getAllLogs(),
        activeTransferService.getAllActiveTransfers(),
        transactionService.getAllTransactions()
      ]);
      setUsers(allUsersFromDb);
      setAdminLogs(logs);
      setAllTransfers(allTransfers);
      setTransactions(allTransactions);
      
      // Also reload current user from fresh list to get latest balance (use fresh user from state)
      const freshUser = allUsersFromDb.find(u => u.id === user.id);
      if (freshUser) {
        setCurrentUser(freshUser);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - use current values from closure

  // Reload data when view changes to DASHBOARD or ADMIN (only once per view change)
  useEffect(() => {
    if (currentUser && (view === 'DASHBOARD' || view === 'ADMIN')) {
      // Use a small delay to avoid race conditions
      const timer = setTimeout(() => {
        reloadUserData();
      }, 100);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, currentUser?.id]); // Only depend on view and user ID

  // Subscribe to real-time messages with automatic reload
  useEffect(() => {
    if (!currentUser) return;

    let reloadTimeout: any = null;
    let lastMessageCount = 0;
    
    const reloadMessages = async () => {
      try {
        const allMessages = await messageService.getMessages(currentUser.id);
        // Always update to ensure we have the latest data
        lastMessageCount = allMessages.length;
        setMessages(allMessages);
        console.log(`✅ Reloaded ${allMessages.length} messages`);
      } catch (error) {
        console.error('Error reloading messages:', error);
      }
    };

    // Initial load
    reloadMessages();

    // Debounced reload function
    const debouncedReload = () => {
      if (reloadTimeout) clearTimeout(reloadTimeout);
      reloadTimeout = setTimeout(reloadMessages, 150);
    };

    const subscription = messageService.subscribeToMessages(
      currentUser.id,
      // Handle new messages (INSERT) - reload all messages immediately
      async (newMessage) => {
        console.log('📨 New message received via realtime:', newMessage);
        // Reload immediately for new messages
        await reloadMessages();
      },
      // Handle updated messages (UPDATE - e.g., marked as read) - reload with debounce
      async (updatedMessage) => {
        console.log('🔄 Message updated via realtime:', updatedMessage);
        debouncedReload();
      }
    );

    // Polling fallback: Check for new messages every 2 seconds as backup
    const pollInterval = setInterval(() => {
      reloadMessages();
    }, 2000);

    return () => {
      if (reloadTimeout) clearTimeout(reloadTimeout);
      clearInterval(pollInterval);
      subscription.unsubscribe();
    };
  }, [currentUser]);

  // Market Simulation Loop (client-side)
  useEffect(() => {
    const interval = setInterval(() => {
      setNovaPrice(prev => {
        const change = (Math.random() - 0.4) * 5;
        const newPrice = Math.max(100, prev + change);
        setNovaHistory(h => [...h.slice(1), newPrice]);
        return newPrice;
      });

      setCompetitorPrice(prev => {
        const change = (Math.random() - 0.7) * 4;
        const newPrice = Math.max(10, prev + change);
        setCompetitorHistory(h => [...h.slice(1), newPrice]);
        return newPrice;
      });

      setMarketData(prev => prev.map(stock => {
        const volatility = stock.price * 0.005;
        const change = (Math.random() - 0.5) * volatility * 2;
        const newPrice = Math.max(0.1, stock.price + change);
        return {
          ...stock,
          price: newPrice,
          change: change,
          trend: change >= 0 ? 'up' : 'down'
        };
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [failingBank]);

  // Derived state: The active transfer for the CURRENTLY logged in user
  const activeTransfer = currentUser && allTransfers[currentUser.id] 
    ? allTransfers[currentUser.id] 
    : { ...DEFAULT_EMPTY_TRANSFER, userId: currentUser?.id };

  // Keep ref in sync with allTransfers state
  useEffect(() => {
    allTransfersRef.current = allTransfers;
  }, [allTransfers]);

  // Transfer Simulation Loop
  useEffect(() => {
    if (!currentUser || !activeTransfer.isActive || activeTransfer.isPaused || activeTransfer.completed) return;

    // Function to calculate interval based on current progress
    // Slower progression for better user experience
    const getProgressInterval = (currentProgress: number): number => {
      if (currentProgress < 25) {
        // 0-25%: ~4.8 seconds per point
        return 4800; // 4.8 seconds
      } else if (currentProgress < 75) {
        // 25-75%: ~4.8 seconds per point
        return 4800; // 4.8 seconds
      } else if (currentProgress < 99) {
        // 75-99%: ~4.8 seconds per point
        return 4800; // 4.8 seconds
      } else {
        // 99-100%: ~5.8 seconds per point
        return 5800; // 5.8 seconds
      }
    };

    let timeoutId: NodeJS.Timeout | null = null;
    let isCancelled = false;

    const processProgress = async () => {
      // Check if effect was cancelled
      if (isCancelled) return;

      // Use ref to get latest state without triggering re-render
      const userTransfer = allTransfersRef.current[currentUser.id];
      if (!userTransfer || !userTransfer.isActive || userTransfer.isPaused || userTransfer.completed) {
        return;
      }

      const nextProgress = userTransfer.progress + 1;
      const pausePoints = [25, 75, 99];
      
      if (pausePoints.includes(nextProgress)) {
        const code = generateSecurityCode();
        const updatedTransfer: ActiveTransfer = {
               ...userTransfer,
               progress: nextProgress,
               isPaused: true,
          requiredCode: code,
               currentStepDescription: `${t('dashboard.transferModal.verificationRequired')} ${nextProgress}%`
        };
        
        setAllTransfers(prev => ({
          ...prev,
          [currentUser.id]: updatedTransfer
        }));
        
        await activeTransferService.createOrUpdateActiveTransfer(updatedTransfer);
        
        // Send validation email to user (non-blocking)
        try {
          console.log('📧 Sending validation email to:', currentUser.email, 'with code:', code);
          
          const response = await fetch('/api/transaction-validation-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: currentUser.name,
              email: currentUser.email,
              language: language,
              code: code,
              amount: userTransfer.amount,
              recipientName: userTransfer.recipientName,
              progress: nextProgress,
            }),
          });

          const data = await response.json();
          
          if (!response.ok) {
            console.error('❌ Failed to send validation email:', data.error || data.details || 'Unknown error');
          } else {
            console.log('✅ Validation email sent successfully:', data.messageId || 'No message ID');
          }
        } catch (error: any) {
          console.error('❌ Error sending validation email:', error.message || error);
          // Silently fail - transaction continues
        }
      } else if (nextProgress >= 100) {
        const completedTransfer: ActiveTransfer = {
               ...userTransfer,
               progress: 100,
               isActive: true, 
               isPaused: false,
               completed: true,
               currentStepDescription: t('dashboard.transferModal.transferCompleted')
        };
        
        setAllTransfers(prev => ({
          ...prev,
          [currentUser.id]: completedTransfer
        }));
        
        await activeTransferService.createOrUpdateActiveTransfer(completedTransfer);
      } else {
        const updatedTransfer: ActiveTransfer = {
            ...userTransfer,
            progress: nextProgress,
            currentStepDescription: `${t('dashboard.transferModal.processing')} ${nextProgress}%`
        };
        
        setAllTransfers(prev => ({
          ...prev,
          [currentUser.id]: updatedTransfer
        }));
        
        // Only save to database every 10% to reduce database writes
        if (nextProgress % 10 === 0) {
          await activeTransferService.createOrUpdateActiveTransfer(updatedTransfer);
        }
        
        // Schedule next progress update with dynamic interval (only if not cancelled)
        if (!isCancelled) {
          const interval = getProgressInterval(nextProgress);
          timeoutId = setTimeout(processProgress, interval);
        }
      }
    };

    // Start the progress loop
    const currentProgress = activeTransfer.progress;
    const initialInterval = getProgressInterval(currentProgress);
    timeoutId = setTimeout(processProgress, initialInterval);

    return () => {
      isCancelled = true;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [currentUser?.id, activeTransfer.isActive, activeTransfer.isPaused, activeTransfer.completed, activeTransfer.progress, t, language]);

  // Process transaction when completed
  useEffect(() => {
    const processTransaction = async () => {
      if (!currentUser || !activeTransfer.completed || !activeTransfer.isActive) {
        return;
      }

      // Check if this transfer has already been processed by checking if a matching transaction exists
      // This prevents processing the same transfer twice (e.g., after page refresh)
      try {
        const userTransactions = await transactionService.getTransactionsByUserId(currentUser.id);
        const transferAlreadyProcessed = userTransactions.some(t => 
          t.type === 'DEBIT' && 
          t.recipientName === activeTransfer.recipientName &&
          Math.abs(t.amount - activeTransfer.amount) < 0.01 && // Allow small floating point differences
          t.status === 'COMPLETED' &&
          // Check if transaction was created within the last 5 minutes (to avoid matching old transactions)
          new Date(t.date).getTime() > Date.now() - 5 * 60 * 1000
        );

        if (transferAlreadyProcessed) {
          console.log(`⚠️ Transfer already processed, cleaning up active transfer for user ${currentUser.id}`);
          // Clean up the active transfer since it's already been processed
          await activeTransferService.deleteActiveTransfer(currentUser.id);
          setAllTransfers(prev => {
            const updated = { ...prev };
            delete updated[currentUser.id];
            return updated;
          });
          return;
        }

        // Mark as processed in ref BEFORE processing to prevent double processing
        if (transactionProcessedRef.current[currentUser.id]) {
          console.log(`⚠️ Transfer already being processed for user ${currentUser.id}`);
          return;
        }
      transactionProcessedRef.current = {
        ...transactionProcessedRef.current,
        [currentUser.id]: true
      };

        // Create transaction in database
        const newTransaction = await transactionService.createTransaction({
          userId: currentUser.id,
      type: 'DEBIT',
          recipientName: activeTransfer.recipientName,
      recipientBank: "Banque Externe",
      recipientIban: "FR76 ... " + Math.floor(1000 + Math.random() * 9000),
          amount: activeTransfer.amount,
      status: 'COMPLETED'
        });

        if (newTransaction) {
          // First, reload user from database to get the latest balance
          const freshUserBefore = await userService.getUserById(currentUser.id);
          if (!freshUserBefore) {
            console.error('Failed to load user before updating balance');
            // Unmark as processed if error
            transactionProcessedRef.current = {
              ...transactionProcessedRef.current,
              [currentUser.id]: false
            };
            return;
          }

          // Calculate new balance using fresh data from database
          const currentBalance = typeof freshUserBefore.balance === 'string' 
            ? parseFloat(freshUserBefore.balance) 
            : freshUserBefore.balance;
          const newBalance = currentBalance - activeTransfer.amount;
          
          console.log(`Processing transfer: User ${currentUser.id}, current balance: ${currentBalance}, amount: ${activeTransfer.amount}, new balance: ${newBalance}`);
          
          // Update balance in database
          const balanceUpdated = await userService.updateBalance(currentUser.id, newBalance);
          
          if (!balanceUpdated) {
            console.error('Failed to update balance after transfer');
            // Unmark as processed if error
            transactionProcessedRef.current = {
              ...transactionProcessedRef.current,
              [currentUser.id]: false
            };
            return;
          }

          // Reload all data from database to ensure consistency
          const [updatedUserFromDb, userTransactions, allUsersFromDb] = await Promise.all([
            userService.getUserById(currentUser.id),
            transactionService.getTransactionsByUserId(currentUser.id),
            userService.getAllUsers()
          ]);

          if (updatedUserFromDb) {
            const actualBalance = typeof updatedUserFromDb.balance === 'string' 
              ? parseFloat(updatedUserFromDb.balance) 
              : updatedUserFromDb.balance;
            
            console.log(`✅ Transfer completed: User ${currentUser.id} balance updated to ${actualBalance} in database`);
            
            // Update local state with fresh data from database
            setCurrentUser(updatedUserFromDb);
            setTransactions(userTransactions);
            
            // Always reload all users to keep the list in sync
            setUsers(allUsersFromDb);
            
            // If admin, also reload admin data
            if (currentUser.role === 'ADMIN') {
              const [logs, allTransfers, allTransactions] = await Promise.all([
                adminLogService.getAllLogs(),
                activeTransferService.getAllActiveTransfers(),
                transactionService.getAllTransactions()
              ]);
              setAdminLogs(logs);
              setAllTransfers(allTransfers);
              setTransactions(allTransactions);
            }
            
            // Save transaction details before cleaning up
            const transactionDetails = {
              amount: activeTransfer.amount,
              recipientName: activeTransfer.recipientName
            };
            setLastCompletedTransaction(transactionDetails);
            
            // IMPORTANT: Clean up the active transfer after successful processing
            await activeTransferService.deleteActiveTransfer(currentUser.id);
            setAllTransfers(prev => {
              const updated = { ...prev };
              delete updated[currentUser.id];
              return updated;
            });
            console.log(`✅ Active transfer cleaned up for user ${currentUser.id}`);
            
            // Open transaction success modal AFTER cleanup to ensure state is ready
            setTimeout(() => {
              openTransactionSuccessModal();
            }, 100);
          } else {
            console.error('Failed to reload user after balance update');
          }
        }
      } catch (error) {
        console.error('Error processing transaction:', error);
        // Unmark as processed if error
        transactionProcessedRef.current = {
          ...transactionProcessedRef.current,
          [currentUser.id]: false
        };
      }
    };

    processTransaction();
  }, [currentUser, activeTransfer.completed, activeTransfer.isActive]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await authService.signIn(email, password);
      if (error) {
        console.error('Login error:', error);
        // Retourner l'erreur pour affichage dans l'UI
        if (error.message.includes('Email not confirmed')) {
          throw new Error(t('auth.login.error.emailNotConfirmed'));
        }
        if (error.message.includes('Invalid login credentials')) {
          throw new Error(t('auth.login.error'));
        }
        throw new Error(error.message || t('auth.login.error.generic'));
      }

      if (data.user) {
        const user = await userService.getUserById(data.user.id);
    if (user) {
      setCurrentUser(user);
      setView(user.role === 'ADMIN' ? 'ADMIN' : 'DASHBOARD', true);
          
          // Load data based on user role
          if (user.role === 'ADMIN') {
            // For admin, load everything in parallel
            const [allUsers, allTransactions, logs, allTransfersData, chatSettings] = await Promise.all([
              userService.getAllUsers(),
              transactionService.getAllTransactions(),
              adminLogService.getAllLogs(),
              activeTransferService.getAllActiveTransfers(),
              adminChatSettingsService.getChatSettings(user.id)
            ]);
            
            const usersWithBalances = allUsers.map(u => ({
              ...u,
              balance: typeof u.balance === 'string' ? parseFloat(u.balance) || 0 : (u.balance || 0)
            }));
            
            setUsers(usersWithBalances);
            setTransactions(allTransactions);
            setAdminLogs(logs);
            setAllTransfers(allTransfersData);
            
            // Load messages for admin
            const userMessages = await messageService.getMessages(user.id);
            setMessages(userMessages);
            
            console.log(`✅ Admin login complete: ${usersWithBalances.length} users, ${allTransactions.length} transactions`);
          } else {
            // For regular users
            const allUsers = await userService.getAllUsers();
            const usersWithBalances = allUsers.map(u => ({
              ...u,
              balance: typeof u.balance === 'string' ? parseFloat(u.balance) || 0 : (u.balance || 0)
            }));
            setUsers(usersWithBalances);
            
            // Load admin chat settings for regular users too (so they can respect the settings)
            const chatSettings = await adminChatSettingsService.getChatSettings();
            if (chatSettings) {
              setAdminChatSettings(chatSettings);
            } else {
              // Default settings if none exist
              const defaultSettings = { showReadReceiptsToUser: true, showTypingToUser: true, showOnlineStatusToUser: true };
              setAdminChatSettings(defaultSettings);
            }
            
            await loadUserData(user.id);
          }
          
      return true;
    }
    }
    return false;
    } catch (error) {
      console.error('Login error:', error);
    return false;
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await authService.signUp(data.email, data.password);
      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error('Failed to create user');
      }

      // 2. Upload avatar if provided
      let avatarUrl = data.avatarUrl;
      // If avatarUrl is a data URL (from file upload), upload it to Supabase
      if (avatarUrl && avatarUrl.startsWith('data:image')) {
        try {
          // Convert data URL to blob
          const response = await fetch(avatarUrl);
          const blob = await response.blob();
          const file = new File([blob], `avatar-${authData.user.id}.png`, { type: 'image/png' });
          
          // Upload to Supabase Storage
          const uploadedUrl = await storageService.uploadAvatar(authData.user.id, file);
          if (uploadedUrl) {
            avatarUrl = uploadedUrl;
          }
        } catch (error) {
          console.error('Error uploading avatar:', error);
          // Fallback to default avatar
          avatarUrl = `https://picsum.photos/seed/${data.email}/200/200`;
        }
      }

      // 3. Create user profile
      const newUser: Partial<User> = {
        id: authData.user.id,
      name: data.name,
      email: data.email,
      role: 'USER',
      balance: 0, 
        avatarUrl: avatarUrl || `https://picsum.photos/seed/${data.email}/200/200`,
      cardNumber: generateCardNumber(),
      cardExpiry: generateExpiry(),
      cardCVC: generateCVC(),
      joinedDate: new Date().toISOString(),
      birthDate: data.birthDate,
      phone: data.phone,
      address: data.address,
      postalCode: data.postalCode,
      country: data.country,
        accountType: data.accountType
      };

      const createdUser = await userService.createUser(newUser);
      if (!createdUser) {
        throw new Error('Failed to create user profile');
      }

      setCurrentUser(createdUser);
      
      // Add to users list
      setUsers(prev => [...prev, createdUser]);
      
      // Send welcome email (non-blocking - don't fail registration if email fails)
      try {
        await fetch('/api/welcome-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            language: language,
          }),
        }).catch((error) => {
          console.error('Failed to send welcome email:', error);
          // Silently fail - registration succeeded
        });
      } catch (error) {
        console.error('Error sending welcome email:', error);
        // Silently fail - registration succeeded
      }
      
      // Open success modal instead of directly redirecting
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.signOut();
    setCurrentUser(null);
    setView('LANDING', true);
    setIsChatOpen(false);
      setMessages([]);
      setTransactions([]);
      setAllTransfers({});
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const openLogoutModal = () => setIsLogoutModalOpen(true);
  const closeLogoutModal = () => setIsLogoutModalOpen(false);
  
  const openSuccessModal = () => setIsSuccessModalOpen(true);
  const closeSuccessModal = () => setIsSuccessModalOpen(false);
  const openAppDownloadModal = () => setIsAppDownloadModalOpen(true);
  const closeAppDownloadModal = () => setIsAppDownloadModalOpen(false);
  const openTransactionSuccessModal = () => setIsTransactionSuccessModalOpen(true);
  const closeTransactionSuccessModal = () => {
    setIsTransactionSuccessModalOpen(false);
    // Clear the transaction details after a short delay to allow the modal to close smoothly
    setTimeout(() => {
      setLastCompletedTransaction(null);
    }, 300);
  };

  const addAdminLog = async (actionType: 'BALANCE_UPDATE' | 'USER_DELETION' | 'SYSTEM', targetUserName: string, description: string) => {
    try {
      const newLog = await adminLogService.createLog({
      adminName: currentUser?.name || 'Système',
      actionType,
      targetUserName,
        description
      }, currentUser?.id);
      
      if (newLog) {
    setAdminLogs(prev => [newLog, ...prev]);
      }
    } catch (error) {
      console.error('Error creating admin log:', error);
    }
  };

  const updateUserBalance = async (userId: string, amount: number): Promise<void> => {
    try {
      // First, reload user from database to get the latest balance
      const targetUserFromDb = await userService.getUserById(userId);
      if (!targetUserFromDb) {
        throw new Error('User not found in database');
      }

      // Calculate new balance using fresh data from database
      const currentBalance = typeof targetUserFromDb.balance === 'string' 
        ? parseFloat(targetUserFromDb.balance) 
        : targetUserFromDb.balance;
      const newBalance = currentBalance + amount;
      
      // 1. Update balance in database
      const balanceUpdated = await userService.updateBalance(userId, newBalance);
      if (!balanceUpdated) {
        throw new Error('Failed to update balance in database');
      }

      // 2. Create transaction in database
    const isCredit = amount > 0;
      const newTransaction = await transactionService.createTransaction({
        userId: userId,
        type: isCredit ? 'CREDIT' : 'DEBIT',
        recipientName: isCredit ? 'Dépôt Admin' : 'Retrait Admin',
        recipientBank: 'Golden Bank System',
        recipientIban: 'N/A',
        amount: Math.abs(amount),
        status: 'COMPLETED'
      });

      if (!newTransaction) {
        throw new Error('Failed to create transaction in database');
      }

      // 3. Log admin action in database
    const actionDesc = isCredit 
        ? `Crédit de ${Math.abs(amount)} ${CURRENCY} ajouté au compte.` 
        : `Débit de ${Math.abs(amount)} ${CURRENCY} retiré du compte.`;
    
      await addAdminLog('BALANCE_UPDATE', targetUserFromDb.name, actionDesc);

      // 4. Reload all data from database to ensure consistency
      // Add a small delay to ensure database consistency
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const [updatedUserFromDb, allUsersFromDb, userTransactions] = await Promise.all([
        userService.getUserById(userId),
        userService.getAllUsers(),
        transactionService.getTransactionsByUserId(userId)
      ]);

      if (updatedUserFromDb) {
        // Verify the balance was actually updated in the database
        const actualBalance = typeof updatedUserFromDb.balance === 'string' 
          ? parseFloat(updatedUserFromDb.balance) 
          : updatedUserFromDb.balance;
        
        console.log(`✅ Balance update verified: User ${userId} balance is now ${actualBalance} (was ${currentBalance}, added ${amount})`);
        
        // Find the updated user in the fresh list to verify
        const userInList = allUsersFromDb.find(u => u.id === userId);
        const userInListBalance = userInList ? (typeof userInList.balance === 'string' ? parseFloat(userInList.balance) : userInList.balance) : 0;
        console.log(`📊 Users list - Updated user balance: ${userInListBalance}, total users in list: ${allUsersFromDb.length}`);
        
        // Update local state with fresh data from database
        // Important: Always reload all users to update the list
        // Create a new array reference to force React to re-render
        console.log(`🔄 Updating users list in state...`);
        console.log(`📊 Users list before update:`, users.length, 'users');
        console.log(`📊 Users list after update:`, allUsersFromDb.length, 'users');
        
        // Calculate total before update for comparison
        const oldTotal = users
          .filter(u => u.role === 'USER')
          .reduce((acc, u) => {
            const b = typeof u.balance === 'string' ? parseFloat(u.balance) || 0 : (u.balance || 0);
            return acc + b;
          }, 0);
        
        // Create deep copy with new references to force React to detect changes
        // IMPORTANT: Create completely new objects for each user to ensure React detects changes
        const usersWithUpdatedBalances = allUsersFromDb.map(u => ({
          ...u,
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          balance: typeof u.balance === 'string' ? parseFloat(u.balance) || 0 : (u.balance || 0),
          avatarUrl: u.avatarUrl,
          accountType: u.accountType,
          cardNumber: u.cardNumber,
          cardExpiry: u.cardExpiry,
          cardCVC: u.cardCVC,
          joinedDate: u.joinedDate,
          birthDate: u.birthDate,
          phone: u.phone,
          address: u.address,
          postalCode: u.postalCode,
          country: u.country ? { ...u.country } : undefined
        }));
        
        const newTotal = usersWithUpdatedBalances
          .filter(u => u.role === 'USER')
          .reduce((acc, u) => acc + (u.balance || 0), 0);
        
        console.log(`💰 Balance totals - Old: ${oldTotal}, New: ${newTotal}`);
        
        // Force update with completely new array reference
        // Create a new array to ensure React detects the change
        const newUsersArray = [...usersWithUpdatedBalances];
        setUsers(newUsersArray);
        console.log(`✅ Users list updated with ${newUsersArray.length} users, total client balance: ${newTotal}`);
        
        // If admin, reload ALL admin data including all transactions
        if (currentUser && currentUser.role === 'ADMIN') {
          console.log(`🔄 Reloading admin data...`);
          const [logs, allTransfers, allTransactions] = await Promise.all([
            adminLogService.getAllLogs(),
            activeTransferService.getAllActiveTransfers(),
            transactionService.getAllTransactions()
          ]);
          setAdminLogs(logs);
          setAllTransfers(allTransfers);
          setTransactions(allTransactions);
          
          // IMPORTANT: Also update users list here to ensure it's in sync
          // Create deep copy with new references to force React to detect changes
          const usersWithUpdatedBalances2 = allUsersFromDb.map(u => ({
            ...u,
            balance: typeof u.balance === 'string' ? parseFloat(u.balance) || 0 : (u.balance || 0)
          }));
          setUsers(usersWithUpdatedBalances2);
          console.log(`✅ Second update of users list with ${usersWithUpdatedBalances2.length} users`);
          
          // Update current admin user from fresh list
          const updatedAdminUser = allUsersFromDb.find(u => u.id === currentUser.id);
          if (updatedAdminUser) {
            setCurrentUser(updatedAdminUser);
          }
          
          // Force another reload of users after a brief delay to ensure UI updates
          // Use a timeout to bypass any caching
          setTimeout(async () => {
            try {
              const freshUsers = await userService.getAllUsers();
              const freshUpdatedUser = freshUsers.find(u => u.id === userId);
              if (freshUpdatedUser) {
                const freshBalance = typeof freshUpdatedUser.balance === 'string' 
                  ? parseFloat(freshUpdatedUser.balance) 
                  : freshUpdatedUser.balance;
                console.log(`🔄 Final reload - User ${userId} balance: ${freshBalance}, updating users list`);
                // Force update by creating new array with new object references to ensure React detects changes
                const usersWithUpdatedBalances = freshUsers.map(u => ({
                  ...u,
                  balance: typeof u.balance === 'string' ? parseFloat(u.balance) || 0 : (u.balance || 0)
                }));
                setUsers(usersWithUpdatedBalances);
                console.log(`✅ Final reload complete, users list should trigger UI update`);
              } else {
                console.warn(`⚠️ User ${userId} not found in fresh reload`);
              }
            } catch (error) {
              console.error('Error in final reload:', error);
            }
          }, 500);
        } else {
          // For non-admin users
          // Update current user if it's the modified user
          if (currentUser && currentUser.id === userId) {
            const balanceToSet = typeof updatedUserFromDb.balance === 'string' 
              ? parseFloat(updatedUserFromDb.balance) 
              : updatedUserFromDb.balance;
            console.log(`✅ Setting currentUser balance from ${currentUser.balance} to ${balanceToSet}`);
            setCurrentUser(updatedUserFromDb);
            // Reload user transactions
            setTransactions(userTransactions);
          }
        }
        
        // IMPORTANT: Force a small delay then reload to ensure state is fully updated
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Force reload user data to ensure UI updates
        if (currentUser && currentUser.id === userId) {
          console.log(`🔄 Force reloading user data for ${userId}`);
          await loadUserData(userId);
        }
      } else {
        console.error('Failed to reload updated user from database');
      }
    } catch (error) {
      console.error('Error updating balance:', error);
      throw error;
    }
  };
  
  const deleteUser = async (userId: string): Promise<void> => {
    try {
    const targetUser = users.find(u => u.id === userId);
    const userName = targetUser?.name || t('common.unknownUser');

      // Delete user using database function (simple and works everywhere)
      // The function checks permissions and deletes from auth.users + public.users
      const deleted = await userService.deleteUser(userId);
      if (!deleted) {
        throw new Error('Failed to delete user from database');
      }

      // 2. Log admin action in database
      await addAdminLog('USER_DELETION', userName, `Suppression définitive du compte et de toutes les données associées.`);

      // 3. Reload all data from database to ensure consistency
      const [allUsersFromDb, logs] = await Promise.all([
        userService.getAllUsers(),
        adminLogService.getAllLogs()
      ]);

      // Update local state with fresh data from database
      setUsers(allUsersFromDb);
      setAdminLogs(logs);
      
      // Clean up local state for deleted user
    setAllTransfers(prev => {
        const copy = { ...prev };
        delete copy[userId];
        return copy;
    });

      // Remove transactions of deleted user from view
      setTransactions(prev => prev.filter(t => t.userId !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };

  const updateUserProfile = async (userId: string, updates: Partial<User>): Promise<void> => {
    try {
      // 1. Update profile in database
      const updatedUser = await userService.updateUser(userId, updates);
      if (!updatedUser) {
        throw new Error('Failed to update profile in database');
      }

      // 2. Reload user from database to ensure consistency
      const freshUser = await userService.getUserById(userId);
      if (!freshUser) {
        throw new Error('Failed to reload user from database');
      }

      // 3. Reload all users list
      const allUsersFromDb = await userService.getAllUsers();

      // 4. Update local state with fresh data from database
      setUsers(allUsersFromDb);
      
      // Update current user if it's the modified user
        if (currentUser && currentUser.id === userId) {
        setCurrentUser(freshUser);
        }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
      }
  };

  const startTransfer = async (amount: number, recipientName: string): Promise<boolean> => {
    if (!currentUser) return false;
    if (currentUser.balance < amount) {
      return false; 
    }

    // Reset processed flag
    if (transactionProcessedRef.current[currentUser.id]) {
         const newRefs = { ...transactionProcessedRef.current };
         delete newRefs[currentUser.id];
         transactionProcessedRef.current = newRefs;
    }

    const newTransfer: ActiveTransfer = {
            userId: currentUser.id,
            isActive: true,
            progress: 0,
            isPaused: false,
            requiredCode: null,
            recipientName,
            amount,
            currentStepDescription: t('dashboard.transferModal.initializing'),
            completed: false
    };

    // 1. Create transfer in database
    const created = await activeTransferService.createOrUpdateActiveTransfer(newTransfer);
    
    if (created) {
      // 2. Reload transfer from database to ensure consistency
      const freshTransfer = await activeTransferService.getActiveTransfer(currentUser.id);
      if (freshTransfer) {
        setAllTransfers(prev => ({
          ...prev,
          [currentUser.id]: freshTransfer
        }));
      } else {
        // Fallback to local state if reload fails
        setAllTransfers(prev => ({
          ...prev,
          [currentUser.id]: newTransfer
        }));
      }
    return true; 
    }
    
    return false; 
  };

  const resetActiveTransfer = async () => {
    if (!currentUser) return;
    
    setAllTransfers(prev => {
        const copy = { ...prev };
        delete copy[currentUser.id];
        return copy;
    });

    await activeTransferService.deleteActiveTransfer(currentUser.id);

    if (transactionProcessedRef.current[currentUser.id]) {
        const newRefs = { ...transactionProcessedRef.current };
        delete newRefs[currentUser.id];
        transactionProcessedRef.current = newRefs;
   }
  };

  const submitSecurityCode = async (code: string): Promise<boolean> => {
    if (!currentUser) return false;
    const userTransfer = allTransfers[currentUser.id];

    if (userTransfer && userTransfer.requiredCode === code) {
      const updatedTransfer: ActiveTransfer = {
            ...userTransfer,
            isPaused: false,
            requiredCode: null,
            currentStepDescription: t('dashboard.transferModal.verificationSuccess')
      };
      
      setAllTransfers(prev => ({
        ...prev,
        [currentUser.id]: updatedTransfer
      }));
      
      await activeTransferService.createOrUpdateActiveTransfer(updatedTransfer);
      return true;
    }
    return false;
  };

  const getActiveCodeForAdmin = (userId: string) => {
    const transfer = allTransfers[userId];
    if (transfer && transfer.isActive) {
        return transfer.requiredCode;
    }
    return null;
  };

  // Chat Functions
  const toggleChat = () => setIsChatOpen(!isChatOpen);

  const sendMessage = async (content: string, receiverId?: string) => {
    if (!currentUser) return;

    let targetId = receiverId;
    if (currentUser.role === 'USER') {
      // Find admin user
      const adminUser = users.find(u => u.role === 'ADMIN');
      targetId = adminUser?.id || 'admin-001';
    }

    if (!targetId) return;

      try {
        // 1. Create message in database
        const newMessage = await messageService.createMessage({
      senderId: currentUser.id,
      receiverId: targetId,
      content,
      isRead: false
        });

        if (newMessage) {
          // 2. Reload messages from database to ensure consistency
          const allMessages = await messageService.getMessages(currentUser.id);
          setMessages(allMessages);
    setTyping(currentUser.id, false);
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
  };

  const markAsRead = async (senderId: string) => {
    if (!currentUser) return;
    
    try {
      // For USER role, if senderId is 'admin-001', find the actual admin user ID
      let actualSenderId = senderId;
      if (currentUser.role === 'USER' && senderId === 'admin-001') {
        const adminUser = users.find(u => u.role === 'ADMIN');
        if (adminUser) {
          actualSenderId = adminUser.id;
        }
      }
      
      // 1. Mark as read in database
      const marked = await messageService.markAsRead(actualSenderId, currentUser.id);
      
      if (marked) {
        // 2. Reload messages from database to ensure consistency
        const allMessages = await messageService.getMessages(currentUser.id);
        setMessages(allMessages);
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const getUnreadCount = () => {
    if (!currentUser) return 0;
    return messages.filter(m => m.receiverId === currentUser.id && !m.isRead).length;
  };

  const setTyping = (userId: string, isTyping: boolean) => {
    setTypingUsers(prev => ({ ...prev, [userId]: isTyping }));
    
    // Broadcast typing status via Supabase Realtime
    if (typingChannelRef.current && currentUser) {
      try {
        const channel = typingChannelRef.current;
        // Check if channel is subscribed before sending
        if (channel.state === 'joined' || channel.state === 'SUBSCRIBED') {
          channel.send({
            type: 'broadcast',
            event: 'typing',
            payload: { userId: currentUser.id, isTyping }
          });
        } else {
          console.warn('Typing channel not ready, state:', channel.state);
        }
      } catch (error) {
        console.error('Error sending typing status:', error);
      }
    }
  };

  // Setup Realtime channels for presence and typing
  useEffect(() => {
    if (!currentUser) {
      // Cleanup channels when user logs out
      if (presenceChannelRef.current) {
        supabase.removeChannel(presenceChannelRef.current);
        presenceChannelRef.current = null;
      }
      if (typingChannelRef.current) {
        supabase.removeChannel(typingChannelRef.current);
        typingChannelRef.current = null;
      }
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }
      setOnlineUsers({});
      setTypingUsers({});
      return;
    }

    // Cleanup existing channels first to ensure fresh connection
    if (presenceChannelRef.current) {
      supabase.removeChannel(presenceChannelRef.current);
      presenceChannelRef.current = null;
    }
    if (typingChannelRef.current) {
      supabase.removeChannel(typingChannelRef.current);
      typingChannelRef.current = null;
    }
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }

    console.log(`🔄 Initializing Realtime channels for user: ${currentUser.id}`);

    // Setup presence channel (shared channel for all users)
    const presenceChannel = supabase.channel('chat-presence', {
      config: {
        presence: {
          key: currentUser.id
        }
      }
    });

    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const presenceState = presenceChannel.presenceState();
        const online: Record<string, boolean> = {};
        Object.keys(presenceState).forEach(userId => {
          if (presenceState[userId] && Array.isArray(presenceState[userId]) && presenceState[userId].length > 0) {
            online[userId] = true;
          }
        });
        setOnlineUsers(online);
        console.log(`✅ Presence synced: ${Object.keys(online).length} users online`);
      })
      .on('presence', { event: 'join' }, ({ key }) => {
        if (key && key !== currentUser.id) {
          setOnlineUsers(prev => ({ ...prev, [key]: true }));
          console.log(`👤 User ${key} came online`);
        }
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        if (key && key !== currentUser.id) {
          setOnlineUsers(prev => {
            const updated = { ...prev };
            delete updated[key];
            return updated;
          });
          console.log(`👋 User ${key} went offline`);
        }
      })
      .subscribe(async (status) => {
        console.log(`📡 Presence channel status: ${status}`);
        if (status === 'SUBSCRIBED') {
          // Track presence immediately
          await presenceChannel.track({
            userId: currentUser.id,
            online: true,
            lastSeen: new Date().toISOString()
          });
          console.log(`✅ Presence tracking started for ${currentUser.id}`);

          // Setup heartbeat to maintain presence (every 30 seconds)
          heartbeatIntervalRef.current = setInterval(async () => {
            try {
              await presenceChannel.track({
                userId: currentUser.id,
                online: true,
                lastSeen: new Date().toISOString()
              });
            } catch (error) {
              console.error('Error updating presence heartbeat:', error);
            }
          }, 30000);
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Presence channel error, attempting to reconnect...');
          // Retry connection after a delay
          setTimeout(() => {
            if (currentUser && presenceChannelRef.current) {
              presenceChannelRef.current.subscribe();
            }
          }, 2000);
        }
      });

    presenceChannelRef.current = presenceChannel;

    // Setup typing channel (shared channel for all users)
    const typingChannel = supabase.channel('chat-typing');

    typingChannel
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        if (payload && payload.userId && payload.userId !== currentUser.id) {
          setTypingUsers(prev => ({ ...prev, [payload.userId]: payload.isTyping }));
          console.log(`⌨️ Typing status: ${payload.userId} is ${payload.isTyping ? 'typing' : 'not typing'}`);
          
          // Auto-clear typing after 3 seconds
          if (payload.isTyping) {
            setTimeout(() => {
              setTypingUsers(prev => {
                const updated = { ...prev };
                if (updated[payload.userId]) {
                  updated[payload.userId] = false;
                }
                return updated;
              });
            }, 3000);
          }
        }
      })
      .subscribe((status) => {
        console.log(`📡 Typing channel status: ${status}`);
        if (status === 'CHANNEL_ERROR') {
          console.error('❌ Typing channel error, attempting to reconnect...');
          // Retry connection after a delay
          setTimeout(() => {
            if (currentUser && typingChannelRef.current) {
              typingChannelRef.current.subscribe();
            }
          }, 2000);
        }
      });

    typingChannelRef.current = typingChannel;

    // Verify channels are connected after a short delay
    const verifyConnection = setTimeout(() => {
      if (presenceChannelRef.current && presenceChannelRef.current.state !== 'joined' && presenceChannelRef.current.state !== 'SUBSCRIBED') {
        console.warn('⚠️ Presence channel not connected, retrying...');
        presenceChannelRef.current.subscribe();
      }
      if (typingChannelRef.current && typingChannelRef.current.state !== 'joined' && typingChannelRef.current.state !== 'SUBSCRIBED') {
        console.warn('⚠️ Typing channel not connected, retrying...');
        typingChannelRef.current.subscribe();
      }
    }, 1000);

    // Cleanup on unmount
    return () => {
      clearTimeout(verifyConnection);
      console.log(`🧹 Cleaning up Realtime channels for user: ${currentUser.id}`);
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }
      if (presenceChannelRef.current) {
        supabase.removeChannel(presenceChannelRef.current);
        presenceChannelRef.current = null;
      }
      if (typingChannelRef.current) {
        supabase.removeChannel(typingChannelRef.current);
        typingChannelRef.current = null;
      }
    };
  }, [currentUser]);

  const updateAdminChatSettings = async (settings: Partial<AdminChatSettings>) => {
    if (!currentUser || currentUser.role !== 'ADMIN') return;
    
    // Update local state immediately for UI responsiveness
    setAdminChatSettings(prev => ({ ...prev, ...settings }));
    
    // Save to database
    try {
      await adminChatSettingsService.updateChatSettings(currentUser.id, settings);
    } catch (error) {
      console.error('Error saving admin chat settings:', error);
      // Revert on error
      setAdminChatSettings(prev => {
        const reverted = { ...prev };
        if (settings.showReadReceiptsToUser !== undefined) {
          reverted.showReadReceiptsToUser = !settings.showReadReceiptsToUser;
        }
        if (settings.showTypingToUser !== undefined) {
          reverted.showTypingToUser = !settings.showTypingToUser;
        }
        return reverted;
      });
    }
  };

  // DO NOT memoize context value - we want components to re-render when ANY value changes
  // Creating a new object ensures React detects changes and triggers re-renders
  const contextValue = {
    currentUser,
    users,
    transactions,
    adminLogs,
    activeTransfer,
    allActiveTransfers: allTransfers,
    view,
    login,
    register,
    logout,
    setView,
    reloadUserData,
    isLogoutModalOpen,
    openLogoutModal,
    closeLogoutModal,
    isSuccessModalOpen,
    openSuccessModal,
    closeSuccessModal,
    isAppDownloadModalOpen,
    openAppDownloadModal,
    closeAppDownloadModal,
    isTransactionSuccessModalOpen,
    openTransactionSuccessModal,
    closeTransactionSuccessModal,
    lastCompletedTransaction,
    updateUserBalance,
    deleteUser,
    updateUserProfile,
    startTransfer,
    submitSecurityCode,
    getActiveCodeForAdmin,
    resetActiveTransfer,
    messages,
    isChatOpen,
    toggleChat,
    sendMessage,
    markAsRead,
    getUnreadCount,
    typingUsers,
    setTyping,
    onlineUsers,
    adminChatSettings,
    updateAdminChatSettings,
    marketState: {
        novaPrice,
        novaHistory,
        failingBank,
        competitorPrice,
        competitorHistory,
        marketData
    },
    language,
    setLanguage,
    t,
    isLoading
  };

  return (
    <BankContext.Provider value={contextValue}>
      {children}
    </BankContext.Provider>
  );
};

export const useBank = () => {
  const context = useContext(BankContext);
  if (context === undefined) {
    throw new Error('useBank must be used within a BankProvider');
  }
  return context;
};
