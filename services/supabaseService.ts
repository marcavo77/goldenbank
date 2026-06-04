import { supabase } from '../lib/supabase';
import { User, Transaction, Message, AdminLog, ActiveTransfer, Country, AccountType, AdminChatSettings } from '../types';
import { generateCardNumber, generateCVC, generateExpiry } from './bankService';

// Convert database user to app User type
const dbUserToUser = (dbUser: any): User => {
  try {
    const balance = dbUser.balance != null 
      ? (typeof dbUser.balance === 'string' ? parseFloat(dbUser.balance) : parseFloat(String(dbUser.balance))) || 0
      : 0;
    
    return {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      role: dbUser.role,
      balance: balance,
      avatarUrl: dbUser.avatar_url || '',
      accountType: dbUser.account_type,
      cardNumber: dbUser.card_number,
      cardExpiry: dbUser.card_expiry,
      cardCVC: dbUser.card_cvc,
      joinedDate: dbUser.joined_date,
      birthDate: dbUser.birth_date,
      phone: dbUser.phone,
      address: dbUser.address,
      postalCode: dbUser.postal_code,
      country: {
        code: dbUser.country_code,
        name: dbUser.country_name,
        flag: dbUser.country_flag
      }
    };
  } catch (err) {
    console.error('❌ Error converting dbUser to User:', err, dbUser);
    throw err;
  }
};

// Convert app User to database format
const userToDbUser = (user: Partial<User>, userId?: string) => {
  const dbUser: any = {
    id: userId || user.id,
    name: user.name,
    email: user.email,
    role: user.role || 'USER',
    balance: user.balance?.toString() || '0',
    avatar_url: user.avatarUrl,
    account_type: user.accountType || 'CURRENT',
    card_number: user.cardNumber,
    card_expiry: user.cardExpiry,
    card_cvc: user.cardCVC,
    joined_date: user.joinedDate || new Date().toISOString(),
    birth_date: user.birthDate,
    phone: user.phone,
    address: user.address,
    postal_code: user.postalCode,
    country_code: user.country?.code,
    country_name: user.country?.name,
    country_flag: user.country?.flag
  };
  return dbUser;
};

// Authentication Services
export const authService = {
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });
    return { data, error };
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  onAuthStateChange(callback: (user: any) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user || null);
    });
  },

  async updateEmail(newEmail: string, userId?: string) {
    // Get current user to find old email
    const { data: { user: currentAuthUser } } = await supabase.auth.getUser();
    if (!currentAuthUser) {
      return { data: null, error: { message: 'User not authenticated' } as any };
    }

    const oldEmail = currentAuthUser.email;
    if (!oldEmail) {
      return { data: null, error: { message: 'Current email not found' } as any };
    }

    // Try using RPC function to update directly in auth.users
    // This ensures immediate update without email confirmation requirement
    try {
      const { error: rpcError } = await supabase.rpc('update_user_credentials', {
        old_email: oldEmail,
        new_email: newEmail,
        new_password: null
      });

      if (!rpcError) {
        // Successfully updated via RPC
        // Refresh the session to reflect the change
        await supabase.auth.refreshSession();
        return { data: { user: currentAuthUser }, error: null };
      } else {
        console.warn('RPC function failed, falling back to standard update:', rpcError);
      }
    } catch (rpcError) {
      console.warn('RPC function not available, using standard update:', rpcError);
    }

    // Fallback to standard Supabase Auth update (requires email confirmation)
    const { data, error: authError } = await supabase.auth.updateUser({
      email: newEmail
    });
    
    if (authError) {
      return { data: null, error: authError };
    }

    // Update email in public.users table
    const targetUserId = userId || data?.user?.id;
    
    if (targetUserId) {
      const { error: dbError } = await supabase
        .from('users')
        .update({ email: newEmail })
        .eq('id', targetUserId);
      
      if (dbError) {
        console.error('Error updating email in public.users:', dbError);
      }
    }

    return { data, error: null };
  },

  async updatePassword(newPassword: string) {
    // Get current user to find email
    const { data: { user: currentAuthUser } } = await supabase.auth.getUser();
    if (!currentAuthUser || !currentAuthUser.email) {
      return { data: null, error: { message: 'User not authenticated' } as any };
    }

    const userEmail = currentAuthUser.email;

    // Try using RPC function to update directly in auth.users
    // This ensures immediate update
    try {
      const { error: rpcError } = await supabase.rpc('update_user_credentials', {
        old_email: userEmail,
        new_email: null,
        new_password: newPassword
      });

      if (!rpcError) {
        // Successfully updated via RPC
        // Refresh the session
        await supabase.auth.refreshSession();
        return { data: { user: currentAuthUser }, error: null };
      } else {
        console.warn('RPC function failed, falling back to standard update:', rpcError);
      }
    } catch (rpcError) {
      console.warn('RPC function not available, using standard update:', rpcError);
    }

    // Fallback to standard Supabase Auth update
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });
    return { data, error };
  }
};

// User Services
export const userService = {
  async createUser(userData: Partial<User>): Promise<User | null> {
    const dbUser = userToDbUser(userData);
    const { data, error } = await supabase
      .from('users')
      .insert([dbUser])
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      return null;
    }

    return dbUserToUser(data);
  },

  async getUserById(userId: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error(`❌ Error fetching user ${userId}:`, error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        return null;
      }

      if (!data) {
        console.warn(`⚠️ getUserById: No data returned for user ${userId}`);
        return null;
      }

      return dbUserToUser(data);
    } catch (err) {
      console.error(`❌ Exception in getUserById for ${userId}:`, err);
      return null;
    }
  },

  async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      console.error('Error fetching user by email:', error);
      return null;
    }

    return dbUserToUser(data);
  },

  async getAllUsers(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('joined_date', { ascending: false });

      if (error) {
        console.error('❌ Error fetching all users:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        return [];
      }

      if (!data) {
        console.warn('⚠️ getAllUsers returned no data');
        return [];
      }

      console.log(`✅ getAllUsers: Successfully fetched ${data.length} users`);
      return data.map(dbUserToUser);
    } catch (err) {
      console.error('❌ Exception in getAllUsers:', err);
      return [];
    }
  },

  async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.email !== undefined) dbUpdates.email = updates.email;
    if (updates.balance !== undefined) dbUpdates.balance = updates.balance.toString();
    if (updates.avatarUrl !== undefined) dbUpdates.avatar_url = updates.avatarUrl;
    if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
    if (updates.address !== undefined) dbUpdates.address = updates.address;
    if (updates.birthDate !== undefined) dbUpdates.birth_date = updates.birthDate;
    if (updates.postalCode !== undefined) dbUpdates.postal_code = updates.postalCode;
    if (updates.country) {
      dbUpdates.country_code = updates.country.code;
      dbUpdates.country_name = updates.country.name;
      dbUpdates.country_flag = updates.country.flag;
    }

    const { data, error } = await supabase
      .from('users')
      .update(dbUpdates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      return null;
    }

    return dbUserToUser(data);
  },

  async updateBalance(userId: string, newBalance: number): Promise<boolean> {
    // Ensure balance is properly formatted as decimal string
    const balanceString = newBalance.toFixed(2);
    
    const { data, error } = await supabase
      .from('users')
      .update({ balance: balanceString })
      .eq('id', userId)
      .select();

    if (error) {
      console.error('Error updating balance:', error);
      console.error('Balance value attempted:', balanceString);
      return false;
    }

    // Verify the update
    if (data && data.length > 0) {
      const updatedBalance = parseFloat(data[0].balance);
      console.log(`Balance updated successfully: ${updatedBalance} for user ${userId}`);
    }

    return true;
  },

  async deleteUser(userId: string): Promise<boolean> {
    // Use the database function to delete user completely (auth + profile)
    // This function checks permissions and deletes from both auth.users and public.users
    const { data, error } = await supabase
      .rpc('delete_user', { target_user_id: userId });

    if (error) {
      console.error('Error deleting user:', error);
      throw new Error(error.message || 'Failed to delete user');
    }

    // The function returns JSON with success status
    if (data && typeof data === 'object' && 'success' in data) {
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete user');
      }
      return true;
    }

    return false;
  }
};

// Transaction Services
export const transactionService = {
  async createTransaction(transaction: Omit<Transaction, 'id' | 'date'>): Promise<Transaction | null> {
    const { data, error } = await supabase
      .from('transactions')
      .insert([{
        user_id: transaction.userId,
        type: transaction.type,
        recipient_name: transaction.recipientName,
        recipient_bank: transaction.recipientBank,
        recipient_iban: transaction.recipientIban,
        amount: transaction.amount.toString(),
        status: transaction.status
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating transaction:', error);
      return null;
    }

    return {
      id: data.id,
      userId: data.user_id,
      type: data.type,
      recipientName: data.recipient_name,
      recipientBank: data.recipient_bank,
      recipientIban: data.recipient_iban,
      amount: parseFloat(data.amount),
      date: data.created_at,
      status: data.status
    };
  },

  async getTransactionsByUserId(userId: string): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }

    return data.map((t: any) => ({
      id: t.id,
      userId: t.user_id,
      type: t.type,
      recipientName: t.recipient_name,
      recipientBank: t.recipient_bank,
      recipientIban: t.recipient_iban,
      amount: parseFloat(t.amount),
      date: t.created_at,
      status: t.status
    }));
  },

  async getAllTransactions(): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all transactions:', error);
      return [];
    }

    return data.map((t: any) => ({
      id: t.id,
      userId: t.user_id,
      type: t.type,
      recipientName: t.recipient_name,
      recipientBank: t.recipient_bank,
      recipientIban: t.recipient_iban,
      amount: parseFloat(t.amount),
      date: t.created_at,
      status: t.status
    }));
  }
};

// Message Services
export const messageService = {
  // Maximum length for message content (optimization for free tier)
  MAX_MESSAGE_LENGTH: 2000,
  
  // Default pagination limit (load only recent messages)
  DEFAULT_MESSAGE_LIMIT: 50,

  async createMessage(message: Omit<Message, 'id' | 'timestamp'>): Promise<Message | null> {
    // Validate message length (optimization: reduce storage)
    if (message.content.length > this.MAX_MESSAGE_LENGTH) {
      console.error(`Message too long: ${message.content.length} characters (max: ${this.MAX_MESSAGE_LENGTH})`);
      throw new Error(`Message trop long. Maximum ${this.MAX_MESSAGE_LENGTH} caractères autorisés.`);
    }

    const { data, error } = await supabase
      .from('messages')
      .insert([{
        sender_id: message.senderId,
        receiver_id: message.receiverId,
        content: message.content.substring(0, this.MAX_MESSAGE_LENGTH), // Ensure max length
        is_read: message.isRead
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating message:', error);
      return null;
    }

    return {
      id: data.id,
      senderId: data.sender_id,
      receiverId: data.receiver_id,
      content: data.content,
      timestamp: data.created_at,
      isRead: data.is_read
    };
  },

  async getMessages(userId: string, limit?: number, beforeDate?: string): Promise<Message[]> {
    // Use pagination to reduce data transfer (optimization for free tier)
    const messageLimit = limit || this.DEFAULT_MESSAGE_LIMIT;
    
    let query = supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false }) // Most recent first
      .limit(messageLimit);

    // If beforeDate is provided, load messages before that date (for "load more")
    if (beforeDate) {
      query = query.lt('created_at', beforeDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }

    // Reverse to get chronological order (oldest first)
    return data.reverse().map((m: any) => ({
      id: m.id,
      senderId: m.sender_id,
      receiverId: m.receiver_id,
      content: m.content,
      timestamp: m.created_at,
      isRead: m.is_read
    }));
  },

  // Get archived messages (for admin or if user wants to see old messages)
  async getArchivedMessages(userId: string, limit: number = 50, beforeDate?: string): Promise<Message[]> {
    let query = supabase
      .from('messages_archive')
      .select('*')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (beforeDate) {
      query = query.lt('created_at', beforeDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching archived messages:', error);
      return [];
    }

    return data.reverse().map((m: any) => ({
      id: m.id,
      senderId: m.sender_id,
      receiverId: m.receiver_id,
      content: m.content,
      timestamp: m.created_at,
      isRead: m.is_read
    }));
  },

  async markAsRead(senderId: string, receiverId: string): Promise<boolean> {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('sender_id', senderId)
      .eq('receiver_id', receiverId)
      .eq('is_read', false);

    if (error) {
      console.error('Error marking messages as read:', error);
      return false;
    }

    return true;
  },

  subscribeToMessages(userId: string, onInsert: (message: Message) => void, onUpdate?: (message: Message) => void) {
    const channelName = `messages:${userId}:${Date.now()}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${userId}`
        },
        (payload) => {
          console.log('Realtime INSERT event (receiver):', payload);
          const m = payload.new as any;
          onInsert({
            id: m.id,
            senderId: m.sender_id,
            receiverId: m.receiver_id,
            content: m.content,
            timestamp: m.created_at,
            isRead: m.is_read
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${userId}`
        },
        (payload) => {
          console.log('Realtime INSERT event (sender):', payload);
          const m = payload.new as any;
          onInsert({
            id: m.id,
            senderId: m.sender_id,
            receiverId: m.receiver_id,
            content: m.content,
            timestamp: m.created_at,
            isRead: m.is_read
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${userId}`
        },
        (payload) => {
          console.log('Realtime UPDATE event (receiver):', payload);
          const m = payload.new as any;
          if (onUpdate) {
            onUpdate({
              id: m.id,
              senderId: m.sender_id,
              receiverId: m.receiver_id,
              content: m.content,
              timestamp: m.created_at,
              isRead: m.is_read
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${userId}`
        },
        (payload) => {
          console.log('Realtime UPDATE event (sender):', payload);
          const m = payload.new as any;
          if (onUpdate) {
            onUpdate({
              id: m.id,
              senderId: m.sender_id,
              receiverId: m.receiver_id,
              content: m.content,
              timestamp: m.created_at,
              isRead: m.is_read
            });
          }
        }
      )
      .subscribe((status) => {
        console.log(`Channel ${channelName} subscription status:`, status);
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to messages channel');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Channel subscription error');
        }
      });

    return {
      unsubscribe: () => {
        console.log(`Unsubscribing from channel ${channelName}`);
        supabase.removeChannel(channel);
      }
    };
  }
};

// Admin Log Services
export const adminLogService = {
  async createLog(log: Omit<AdminLog, 'id' | 'timestamp'>, adminId?: string): Promise<AdminLog | null> {
    const { data, error } = await supabase
      .from('admin_logs')
      .insert([{
        admin_id: adminId || null,
        admin_name: log.adminName,
        action_type: log.actionType,
        target_user_id: null,
        target_user_name: log.targetUserName,
        description: log.description
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating admin log:', error);
      return null;
    }

    return {
      id: data.id,
      adminName: data.admin_name,
      actionType: data.action_type,
      targetUserName: data.target_user_name,
      description: data.description,
      timestamp: data.created_at
    };
  },

  async getAllLogs(): Promise<AdminLog[]> {
    const { data, error } = await supabase
      .from('admin_logs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching admin logs:', error);
      return [];
    }

    return data.map((l: any) => ({
      id: l.id,
      adminName: l.admin_name,
      actionType: l.action_type,
      targetUserName: l.target_user_name,
      description: l.description,
      timestamp: l.created_at
    }));
  }
};

// Active Transfer Services
export const activeTransferService = {
  async getActiveTransfer(userId: string): Promise<ActiveTransfer | null> {
    const { data, error } = await supabase
      .from('active_transfers')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No active transfer found
        return null;
      }
      console.error('Error fetching active transfer:', error);
      return null;
    }

    return {
      userId: data.user_id,
      isActive: data.is_active,
      progress: data.progress,
      isPaused: data.is_paused,
      requiredCode: data.required_code,
      recipientName: data.recipient_name,
      amount: parseFloat(data.amount),
      currentStepDescription: data.current_step_description,
      completed: data.completed
    };
  },

  async createOrUpdateActiveTransfer(transfer: ActiveTransfer): Promise<boolean> {
    const { error } = await supabase
      .from('active_transfers')
      .upsert([{
        user_id: transfer.userId,
        is_active: transfer.isActive,
        progress: transfer.progress,
        is_paused: transfer.isPaused,
        required_code: transfer.requiredCode,
        recipient_name: transfer.recipientName,
        amount: transfer.amount.toString(),
        current_step_description: transfer.currentStepDescription,
        completed: transfer.completed
      }], {
        onConflict: 'user_id'
      });

    if (error) {
      console.error('Error creating/updating active transfer:', error);
      return false;
    }

    return true;
  },

  async deleteActiveTransfer(userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('active_transfers')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting active transfer:', error);
      return false;
    }

    return true;
  },

  async getAllActiveTransfers(): Promise<Record<string, ActiveTransfer>> {
    const { data, error } = await supabase
      .from('active_transfers')
      .select('*')
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching all active transfers:', error);
      return {};
    }

    const transfers: Record<string, ActiveTransfer> = {};
    data.forEach((t: any) => {
      transfers[t.user_id] = {
        userId: t.user_id,
        isActive: t.is_active,
        progress: t.progress,
        isPaused: t.is_paused,
        requiredCode: t.required_code,
        recipientName: t.recipient_name,
        amount: parseFloat(t.amount),
        currentStepDescription: t.current_step_description,
        completed: t.completed
      };
    });

    return transfers;
  }
};

// Storage Services
export const storageService = {
  async uploadAvatar(userId: string, file: File): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop() || 'png';
      const fileName = `${userId}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      // Delete existing avatar if any
      await supabase.storage
        .from('avatars')
        .remove([filePath]);

      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type
        });

      if (uploadError) {
        console.error('Error uploading avatar:', uploadError);
        return null;
      }

      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error in uploadAvatar:', error);
      return null;
    }
  }
};

// Admin Chat Settings Service
export const adminChatSettingsService = {
  async getChatSettings(adminId?: string): Promise<AdminChatSettings | null> {
    // If no adminId provided, find the admin user
    let targetAdminId = adminId;
    if (!targetAdminId) {
      const { data: adminUsers } = await supabase
        .from('users')
        .select('id')
        .eq('role', 'ADMIN')
        .limit(1)
        .single();
      
      if (adminUsers) {
        targetAdminId = adminUsers.id;
      } else {
        return null;
      }
    }
    
    const { data, error } = await supabase
      .from('admin_chat_settings')
      .select('*')
      .eq('admin_id', targetAdminId)
      .single();

    if (error) {
      // If no settings exist, return null (will create default)
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error fetching admin chat settings:', error);
      return null;
    }

    return {
      showReadReceiptsToUser: data.show_read_receipts_to_user,
      showTypingToUser: data.show_typing_to_user,
      showOnlineStatusToUser: data.show_online_status_to_user ?? true
    };
  },

  async updateChatSettings(adminId: string, settings: Partial<AdminChatSettings>): Promise<boolean> {
    // First check if settings exist (must pass adminId explicitly for updates)
    const existing = await this.getChatSettings(adminId);

    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (settings.showReadReceiptsToUser !== undefined) {
      updateData.show_read_receipts_to_user = settings.showReadReceiptsToUser;
    }
    if (settings.showTypingToUser !== undefined) {
      updateData.show_typing_to_user = settings.showTypingToUser;
    }
    if (settings.showOnlineStatusToUser !== undefined) {
      updateData.show_online_status_to_user = settings.showOnlineStatusToUser;
    }

    if (existing) {
      // Update existing settings
      const { error } = await supabase
        .from('admin_chat_settings')
        .update(updateData)
        .eq('admin_id', adminId);

      if (error) {
        console.error('Error updating admin chat settings:', error);
        return false;
      }
    } else {
      // Create new settings with defaults
      const { error } = await supabase
        .from('admin_chat_settings')
        .insert([{
          admin_id: adminId,
          show_read_receipts_to_user: settings.showReadReceiptsToUser !== undefined ? settings.showReadReceiptsToUser : true,
          show_typing_to_user: settings.showTypingToUser !== undefined ? settings.showTypingToUser : true,
          show_online_status_to_user: settings.showOnlineStatusToUser !== undefined ? settings.showOnlineStatusToUser : true
        }]);

      if (error) {
        console.error('Error creating admin chat settings:', error);
        return false;
      }
    }

    return true;
  }
};

