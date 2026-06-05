

import React, { useState, useEffect, useRef } from 'react';
import { useBank } from '../context/BankContext';
import { messageService } from '../services/supabaseService';
import { Send, X, MessageSquare, User as UserIcon, ShieldCheck, Check, CheckCheck, Settings, ToggleLeft, ToggleRight, MoreVertical, ArrowLeft } from 'lucide-react';

const TypingIndicator = () => (
  <div className="flex gap-1 items-center p-2 rounded-xl bg-slate-700 w-fit">
    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
  </div>
);

// Format date like WhatsApp: "Aujourd'hui", "Hier", or full date
// This function returns a key that should be translated in the component
// Returns a formatted date string using the provided locale
const getDateHeaderKey = (date: Date, locale: string): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const messageDate = new Date(date);
  messageDate.setHours(0, 0, 0, 0);
  
  if (messageDate.getTime() === today.getTime()) {
    return 'common.today';
  } else if (messageDate.getTime() === yesterday.getTime()) {
    return 'common.yesterday';
  } else {
    // Map language codes to locales for date formatting
    const localeMap: Record<string, string> = {
      'fr': 'fr-FR',
      'en': 'en-US',
      'es': 'es-ES',
      'de': 'de-DE',
      'it': 'it-IT',
      'pt': 'pt-PT',
      'nl': 'nl-NL',
      'ru': 'ru-RU',
      'zh': 'zh-CN',
      'ja': 'ja-JP',
      'ar': 'ar-SA'
    };
    const dateLocale = localeMap[locale] || 'en-US';
    
    // Format date using the current language locale
    const formatted = messageDate.toLocaleDateString(dateLocale, { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long',
      year: messageDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }
};

// Check if two dates are on the same day
const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

const ChatWidget: React.FC = () => {
  const { 
    currentUser, 
    isChatOpen, 
    toggleChat, 
    messages, 
    sendMessage, 
    users,
    markAsRead,
    getUnreadCount,
    typingUsers,
    setTyping,
    onlineUsers,
    adminChatSettings,
    updateAdminChatSettings,
    t,
    language
  } = useBank();

  const [inputText, setInputText] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showAdminSettings, setShowAdminSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<any>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const adminMessagesContainerRef = useRef<HTMLDivElement>(null); // Separate ref for admin view
  const shouldAutoScrollRef = useRef(true);
  const adminShouldAutoScrollRef = useRef(true); // Separate ref for admin view
  const previousMessagesLengthRef = useRef(0);
  const previousAdminMessagesLengthRef = useRef(0); // Track admin messages separately

  // Check if user is near bottom of scroll area
  const isNearBottom = (element: HTMLElement): boolean => {
    const threshold = 100; // pixels from bottom
    return element.scrollHeight - element.scrollTop - element.clientHeight < threshold;
  };

  // Scroll to bottom for user view only when necessary
  useEffect(() => {
    if (currentUser?.role === 'ADMIN') return; // Skip for admin view
    
    if (!messagesContainerRef.current || !messagesEndRef.current) return;

    const container = messagesContainerRef.current;
    const messagesLength = messages.length;
    const previousLength = previousMessagesLengthRef.current;

    // Only auto-scroll if:
    // 1. Chat just opened (shouldAutoScrollRef is true)
    // 2. New message was added (messages length increased) AND user is near bottom
    const hasNewMessage = messagesLength > previousLength;
    const isUserNearBottom = isNearBottom(container);

    if (shouldAutoScrollRef.current || (hasNewMessage && isUserNearBottom)) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      shouldAutoScrollRef.current = false; // Reset after scrolling
    }

    previousMessagesLengthRef.current = messagesLength;
  }, [messages, isChatOpen, currentUser?.role]);

  // Scroll to bottom for admin view only when necessary
  useEffect(() => {
    if (currentUser?.role !== 'ADMIN' || !selectedUserId) return;
    
    if (!adminMessagesContainerRef.current || !messagesEndRef.current) return;

    const container = adminMessagesContainerRef.current;
    const activeMessages = messages.filter(m => 
      (m.senderId === currentUser.id && m.receiverId === selectedUserId) ||
      (m.senderId === selectedUserId && m.receiverId === currentUser.id)
    );
    const messagesLength = activeMessages.length;
    const previousLength = previousAdminMessagesLengthRef.current;

    // Only auto-scroll if:
    // 1. Chat just opened or conversation changed (adminShouldAutoScrollRef is true)
    // 2. New message was added (messages length increased) AND user is near bottom
    const hasNewMessage = messagesLength > previousLength;
    const isUserNearBottom = isNearBottom(container);

    if (adminShouldAutoScrollRef.current || (hasNewMessage && isUserNearBottom)) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      adminShouldAutoScrollRef.current = false; // Reset after scrolling
    }

    previousAdminMessagesLengthRef.current = messagesLength;
  }, [messages, selectedUserId, isChatOpen, currentUser?.role, currentUser?.id]);

  // Reset auto-scroll when chat opens or conversation changes (for user view)
  useEffect(() => {
    if (isChatOpen && currentUser?.role !== 'ADMIN') {
      shouldAutoScrollRef.current = true;
    }
  }, [isChatOpen, currentUser?.role]);

  // Reset auto-scroll when chat opens or conversation changes (for admin view)
  useEffect(() => {
    if (isChatOpen && currentUser?.role === 'ADMIN' && selectedUserId) {
      adminShouldAutoScrollRef.current = true;
    }
  }, [isChatOpen, selectedUserId, currentUser?.role]);

  // Track manual scrolling for user view
  useEffect(() => {
    if (currentUser?.role === 'ADMIN') return; // Skip for admin view
    
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // If user scrolls up, disable auto-scroll
      if (!isNearBottom(container)) {
        shouldAutoScrollRef.current = false;
      } else {
        // If user scrolls back to bottom, re-enable auto-scroll
        shouldAutoScrollRef.current = true;
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [currentUser?.role]);

  // Track manual scrolling for admin view
  useEffect(() => {
    if (currentUser?.role !== 'ADMIN') return;
    
    const container = adminMessagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // If user scrolls up, disable auto-scroll
      if (!isNearBottom(container)) {
        adminShouldAutoScrollRef.current = false;
      } else {
        // If user scrolls back to bottom, re-enable auto-scroll
        adminShouldAutoScrollRef.current = true;
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [currentUser?.role]);

  // Mark as read when opening specific conversation
  useEffect(() => {
    if (isChatOpen && currentUser) {
        if (currentUser.role === 'ADMIN' && selectedUserId) {
             markAsRead(selectedUserId);
        } else if (currentUser.role === 'USER') {
             // Find the actual admin user ID
             const adminUser = users.find(u => u.role === 'ADMIN');
             if (adminUser) {
               markAsRead(adminUser.id);
             } else {
               // Fallback to 'admin-001' if admin not found in users list
               markAsRead('admin-001');
             }
        }
    }
  }, [isChatOpen, selectedUserId, messages, currentUser, users, markAsRead]);

  // If no user is logged in, do not show the chat widget at all
  if (!currentUser) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Limit input length (optimization: reduce storage)
    if (newValue.length <= messageService.MAX_MESSAGE_LENGTH) {
      setInputText(newValue);
    }

    // Typing Logic
    if (currentUser) {
        setTyping(currentUser.id, true);
        
        // Debounce: Stop typing after 2 seconds of inactivity
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            setTyping(currentUser.id, false);
        }, 2000);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    // Validate message length
    if (inputText.length > messageService.MAX_MESSAGE_LENGTH) {
      const errorMsg = t('chat.messageTooLong').replace('{max}', messageService.MAX_MESSAGE_LENGTH.toString());
      alert(errorMsg);
      return;
    }

    // Enable auto-scroll when user sends a message
    if (currentUser.role === 'ADMIN') {
      adminShouldAutoScrollRef.current = true;
    } else {
      shouldAutoScrollRef.current = true;
    }

    if (currentUser.role === 'ADMIN') {
        if (selectedUserId) {
            sendMessage(inputText, selectedUserId);
        }
    } else {
        sendMessage(inputText);
    }
    setInputText('');
    // Clear typing immediately upon send
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    setTyping(currentUser.id, false);
  };

  const unreadCount = getUnreadCount();

  // Helper to render checkmarks
  const renderStatus = (isRead: boolean) => {
    if (isRead) return <CheckCheck className="h-3.5 w-3.5 text-teal-400" />;
    return <Check className="h-3.5 w-3.5 text-teal-100" />;
  };

  // --- CLOSED STATE: Floating Action Button ---
  if (!isChatOpen) {
    return (
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-[60] w-14 h-14 bg-teal-400 hover:bg-teal-500 text-white rounded-full shadow-[0_4px_20px_rgba(16,185,129,0.4)] transition-all hover:scale-110 flex items-center justify-center group animate-fade-in-up"
        aria-label={t('chat.open')}
      >
        <MessageSquare className="h-7 w-7" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold min-w-[1.5rem] h-6 px-1 rounded-full flex items-center justify-center border-2 border-slate-900 animate-bounce">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
        
        {/* Hover Tooltip - Hidden on mobile */}
        <span className="hidden md:block absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-slate-800 text-white text-sm font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-slate-700 shadow-xl">
            {t('chat.needHelp')}
            {/* Arrow */}
            <span className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45 border-t border-r border-slate-700"></span>
        </span>
      </button>
    );
  }

  // --- OPEN STATE: ADMIN VIEW ---
  if (currentUser.role === 'ADMIN') {
    const usersWithMessages = Array.from(new Set([
        ...messages.map(m => m.senderId),
        ...messages.map(m => m.receiverId)
    ])).filter(id => id !== currentUser.id);

    const chatUsers = users.filter(u => u.role === 'USER').sort((a, b) => {
        const aUnread = messages.some(m => m.senderId === a.id && !m.isRead);
        const bUnread = messages.some(m => m.senderId === b.id && !m.isRead);
        if (aUnread && !bUnread) return -1;
        if (!aUnread && bUnread) return 1;
        return 0;
    });

    const activeMessages = selectedUserId 
        ? messages.filter(m => 
            (m.senderId === currentUser.id && m.receiverId === selectedUserId) ||
            (m.senderId === selectedUserId && m.receiverId === currentUser.id)
          ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        : [];

    return (
        <div className="fixed inset-0 z-[70] md:inset-auto md:bottom-4 md:right-4 w-full h-full md:w-[800px] md:h-[500px] bg-slate-900 border-0 md:border md:border-slate-700 md:rounded-2xl shadow-2xl flex overflow-hidden animate-fade-in-up">
            {/* Sidebar List - Hidden on mobile if user selected */}
            <div className={`w-full md:w-1/3 bg-slate-800 border-r border-slate-700 flex-col ${selectedUserId ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-slate-700 bg-slate-800 flex justify-between items-center">
                    <h3 className="font-bold text-white">{t('chat.discussions')}</h3>
                    <div className="flex items-center gap-2">
                         <div className="bg-teal-400 text-xs px-2 py-1 rounded text-white font-bold">{t('chat.admin')}</div>
                         <button onClick={toggleChat} className="md:hidden text-gray-400 hover:text-white">
                             <X className="h-5 w-5"/>
                         </button>
                    </div>
                </div>
                <div ref={messagesContainerRef} className="flex-1 overflow-y-auto custom-scrollbar">
                    {chatUsers.map(user => {
                        const userUnread = messages.filter(m => m.senderId === user.id && !m.isRead && m.receiverId === currentUser.id).length;
                        const lastMsg = messages.filter(m => m.senderId === user.id || m.receiverId === user.id)
                            .sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
                        const isTyping = typingUsers[user.id];

                        return (
                            <div 
                                key={user.id}
                                onClick={() => setSelectedUserId(user.id)}
                                className={`p-3 border-b border-slate-700/50 cursor-pointer hover:bg-slate-700 transition-colors ${selectedUserId === user.id ? 'bg-slate-700' : ''}`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-sm text-white truncate max-w-[120px]">{user.name}</span>
                                        {onlineUsers[user.id] && (
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title={t('common.online')}></div>
                                        )}
                                    </div>
                                    {userUnread > 0 && (
                                        <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{userUnread}</span>
                                    )}
                                </div>
                                <div className={`text-xs truncate ${isTyping ? 'text-teal-300 font-bold animate-pulse' : 'text-gray-400'}`}>
                                    {isTyping ? t('chat.typing') : (
                                        lastMsg ? (lastMsg.senderId === currentUser.id ? t('common.you') + ': ' : '') + lastMsg.content : t('chat.noMessage')
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Chat Area - Hidden on mobile if no user selected */}
            <div className={`w-full md:w-2/3 flex-col bg-slate-900 relative ${!selectedUserId ? 'hidden md:flex' : 'flex'}`}>
                {/* Admin Settings Modal Overlay */}
                {showAdminSettings && (
                    <div className="absolute top-14 right-4 z-50 bg-slate-800 border border-slate-600 rounded-xl p-4 shadow-xl w-64 animate-fade-in-up">
                        <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                            <Settings className="h-4 w-4" /> {t('chat.settings')}
                        </h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-300 text-sm">{t('chat.readReceipts')}</span>
                                <button onClick={() => updateAdminChatSettings({ showReadReceiptsToUser: !adminChatSettings.showReadReceiptsToUser })}>
                                    {adminChatSettings.showReadReceiptsToUser 
                                        ? <ToggleRight className="h-6 w-6 text-teal-400" /> 
                                        : <ToggleLeft className="h-6 w-6 text-gray-500" />}
                                </button>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-300 text-sm">{t('chat.typingIndicator')}</span>
                                <button onClick={() => updateAdminChatSettings({ showTypingToUser: !adminChatSettings.showTypingToUser })}>
                                    {adminChatSettings.showTypingToUser 
                                        ? <ToggleRight className="h-6 w-6 text-teal-400" /> 
                                        : <ToggleLeft className="h-6 w-6 text-gray-500" />}
                                </button>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-300 text-sm">{t('chat.onlineStatus')}</span>
                                <button onClick={() => updateAdminChatSettings({ showOnlineStatusToUser: !adminChatSettings.showOnlineStatusToUser })}>
                                    {adminChatSettings.showOnlineStatusToUser 
                                        ? <ToggleRight className="h-6 w-6 text-teal-400" /> 
                                        : <ToggleLeft className="h-6 w-6 text-gray-500" />}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="p-4 border-b border-slate-700 bg-slate-800/50 flex justify-between items-center">
                    {selectedUserId ? (
                        <div className="flex items-center gap-2">
                            {/* Back button for mobile */}
                            <button className="md:hidden mr-2 text-gray-400 hover:text-white" onClick={() => setSelectedUserId(null)}>
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
                                <img src={users.find(u => u.id === selectedUserId)?.avatarUrl} alt="" className="w-full h-full object-cover"/>
                            </div>
                            <div>
                                <span className="font-bold text-white block leading-none">{users.find(u => u.id === selectedUserId)?.name}</span>
                                {typingUsers[selectedUserId] ? (
                                    <span className="text-[10px] text-teal-300 animate-pulse block">{t('common.typing')}</span>
                                ) : onlineUsers[selectedUserId] ? (
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shrink-0" title={t('common.online')}></div>
                                        <span className="text-[10px] text-green-400">{t('common.online')}</span>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    ) : (
                        <span className="text-gray-400 text-sm">{t('chat.selectUser')}</span>
                    )}
                    <div className="flex gap-2">
                         <button 
                            onClick={() => setShowAdminSettings(!showAdminSettings)}
                            className={`text-gray-400 hover:text-white p-1 rounded hover:bg-slate-700 ${showAdminSettings ? 'bg-slate-700 text-white' : ''}`}
                            title={t('chat.settings')}
                        >
                            <MoreVertical className="h-5 w-5"/>
                        </button>
                        <button onClick={toggleChat} className="text-gray-400 hover:text-white p-1 rounded hover:bg-slate-700">
                            <X className="h-5 w-5"/>
                        </button>
                    </div>
                </div>

                <div ref={adminMessagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-900">
                    {!selectedUserId ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500">
                            <MessageSquare className="h-12 w-12 mb-2 opacity-20" />
                            <p>{t('chat.selectConversation')}</p>
                        </div>
                    ) : activeMessages.length === 0 ? (
                        <div className="text-center text-gray-500 text-sm mt-10">{t('chat.startConversation')}</div>
                    ) : (
                        activeMessages.map((msg, index) => {
                            const msgDate = new Date(msg.timestamp);
                            const prevMsgDate = index > 0 ? new Date(activeMessages[index - 1].timestamp) : null;
                            const showDateSeparator = !prevMsgDate || !isSameDay(msgDate, prevMsgDate);
                            
                            return (
                                <React.Fragment key={msg.id}>
                                    {showDateSeparator && (
                                        <div className="text-center py-2">
                                            <div className="inline-block px-3 py-1 bg-slate-800 rounded-full text-xs text-gray-400 border border-slate-700">
                                                {(() => {
                                                  const dateKey = getDateHeaderKey(msgDate, language);
                                                  return dateKey.startsWith('common.') ? t(dateKey) : dateKey;
                                                })()}
                                            </div>
                                        </div>
                                    )}
                                    <div className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] rounded-xl p-3 text-sm ${
                                            msg.senderId === currentUser.id 
                                            ? 'bg-teal-500 text-white rounded-tr-none' 
                                            : 'bg-slate-700 text-gray-200 rounded-tl-none'
                                        }`}>
                                            {msg.content}
                                            <div className="flex justify-end items-center gap-1 mt-1">
                                                <div className={`text-[10px] ${msg.senderId === currentUser.id ? 'text-teal-100' : 'text-gray-400'}`}>
                                                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                </div>
                                                {/* Admins always see read receipts */}
                                                {msg.senderId === currentUser.id && (
                                                    <span className="ml-1">
                                                        {msg.isRead ? <CheckCheck className="h-3.5 w-3.5 text-teal-200" /> : <Check className="h-3.5 w-3.5 text-teal-100" />}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </React.Fragment>
                            );
                        })
                    )}
                    {/* Admin view of User typing bubble in chat area as well */}
                    {selectedUserId && typingUsers[selectedUserId] && (
                        <div className="flex justify-start animate-fade-in-up">
                            <TypingIndicator />
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {selectedUserId && (
                    <form onSubmit={handleSend} className="p-3 border-t border-slate-700 bg-slate-800/50 flex flex-col gap-2">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputText}
                                onChange={handleInputChange}
                                placeholder={t('chat.writeMessage')}
                                maxLength={messageService.MAX_MESSAGE_LENGTH}
                                className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-400"
                            />
                            <button type="submit" className="bg-teal-400 hover:bg-teal-500 text-white p-2 rounded-lg transition-colors">
                                <Send className="h-5 w-5" />
                            </button>
                        </div>
                        {inputText.length > messageService.MAX_MESSAGE_LENGTH * 0.8 && (
                            <div className={`text-xs text-right ${inputText.length >= messageService.MAX_MESSAGE_LENGTH ? 'text-red-400' : 'text-gray-400'}`}>
                                {inputText.length} / {messageService.MAX_MESSAGE_LENGTH} {t('chat.characters')}
                            </div>
                        )}
                    </form>
                )}
            </div>
        </div>
    );
  }

  // --- OPEN STATE: USER VIEW ---
  const myMessages = messages.filter(m => 
    m.senderId === currentUser.id || m.receiverId === currentUser.id
  ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  // Find the actual admin user ID
  const adminUser = users.find(u => u.role === 'ADMIN');
  const adminId = adminUser?.id || 'admin-001';
  
  // Check if Admin is typing
  const isAdminTyping = typingUsers[adminId];

  return (
    <div className="fixed inset-0 z-[70] md:inset-auto md:bottom-4 md:right-4 w-full h-full md:w-[350px] lg:w-[400px] md:h-[500px] bg-slate-900 border-0 md:border md:border-slate-700 md:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up">
      {/* Header */}
      <div className="p-4 bg-teal-500 flex justify-between items-center shadow-lg relative z-10">
        <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
                <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
                <h3 className="font-bold text-white">{t('chat.support')}</h3>
                <div className="flex items-center gap-1.5 h-4">
                    {/* Show typing status only if allowed by Admin Settings */}
                    {isAdminTyping && adminChatSettings.showTypingToUser ? (
                        <span className="text-blue-100 text-xs font-medium animate-pulse">{t('common.typing')}</span>
                    ) : adminChatSettings.showOnlineStatusToUser ? (
                        <>
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-blue-100 text-xs">{t('common.online')}</span>
                        </>
                    ) : null}
                </div>
            </div>
        </div>
        <button onClick={toggleChat} className="text-blue-100 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-1.5 transition-colors">
            <X className="h-5 w-5"/>
        </button>
      </div>

      {/* Messages */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-800/50">
        {/* Welcome Message */}
        <div className="flex justify-start">
             <div className="flex items-end gap-2 max-w-[85%]">
                <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center shrink-0 text-white text-xs font-bold shadow-lg">G</div>
                <div className="bg-slate-700 text-gray-200 rounded-2xl rounded-bl-none p-3 text-sm shadow-md">
                   {t('chat.welcome')} {currentUser.name}, {t('chat.welcomeMessage')}
                </div>
             </div>
        </div>

        {myMessages.map((msg, index) => {
            const msgDate = new Date(msg.timestamp);
            const prevMsgDate = index > 0 ? new Date(myMessages[index - 1].timestamp) : null;
            const showDateSeparator = !prevMsgDate || !isSameDay(msgDate, prevMsgDate);
            
            return (
                <React.Fragment key={msg.id}>
                    {showDateSeparator && (
                        <div className="text-center py-2">
                            <div className="inline-block px-3 py-1 bg-slate-800 rounded-full text-xs text-gray-400 border border-slate-700">
                                {(() => {
                                  const dateKey = getDateHeaderKey(msgDate, language);
                                  return dateKey.startsWith('common.') ? t(dateKey) : dateKey;
                                })()}
                            </div>
                        </div>
                    )}
                    <div className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                        {msg.senderId !== currentUser.id && (
                             <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center shrink-0 text-white text-xs font-bold shadow-lg mr-2 self-end">G</div>
                        )}
                        <div className={`max-w-[80%] rounded-2xl p-3 text-sm shadow-md ${
                            msg.senderId === currentUser.id 
                            ? 'bg-teal-500 text-white rounded-br-none' 
                            : 'bg-slate-700 text-gray-200 rounded-bl-none'
                        }`}>
                            {msg.content}
                            <div className="flex justify-end items-center gap-1 mt-1">
                                <div className={`text-[10px] ${msg.senderId === currentUser.id ? 'text-teal-100' : 'text-gray-400'}`}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </div>
                                {/* Only show read receipt if sender is current user AND Admin allows it */}
                                {msg.senderId === currentUser.id && adminChatSettings.showReadReceiptsToUser && (
                                    <span className="ml-1">
                                        {renderStatus(msg.isRead)}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            );
        })}

        {/* Admin Typing Indicator Bubble */}
        {isAdminTyping && adminChatSettings.showTypingToUser && (
             <div className="flex justify-start animate-fade-in-up">
                 <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center shrink-0 text-white text-xs font-bold shadow-lg mr-2 self-end">G</div>
                 <TypingIndicator />
             </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-slate-700 flex flex-col gap-2">
        <div className="flex gap-2">
          <input
              type="text"
              value={inputText}
              onChange={handleInputChange}
              placeholder={t('chat.askQuestion')}
              maxLength={messageService.MAX_MESSAGE_LENGTH}
              className="flex-1 bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-400 transition-colors"
          />
          <button type="submit" className="bg-teal-400 hover:bg-teal-500 text-white p-3 rounded-xl transition-colors shadow-lg shadow-teal-400/20">
              <Send className="h-5 w-5" />
          </button>
        </div>
        {inputText.length > messageService.MAX_MESSAGE_LENGTH * 0.8 && (
          <div className={`text-xs text-right ${inputText.length >= messageService.MAX_MESSAGE_LENGTH ? 'text-red-400' : 'text-gray-400'}`}>
            {inputText.length} / {messageService.MAX_MESSAGE_LENGTH} {t('chat.characters')}
          </div>
        )}
      </form>
    </div>
  );
};

export default ChatWidget;
