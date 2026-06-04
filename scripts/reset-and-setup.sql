-- ============================================================
-- RESET + RECONSTRUCTION COMPLÈTE DE LA BASE AZUR BANK
-- Inspiré du schéma NovaBank, recrée tout proprement
-- ============================================================
-- Exécutez ce script EN UNE FOIS dans le SQL Editor Supabase
-- ============================================================

BEGIN;

-- ============================================================
-- PHASE 1 : EFFACER TOUTES LES TABLES EXISTANTES
-- ============================================================

-- Supprimer les triggers d'abord
DROP TRIGGER IF EXISTS update_active_transfers_updated_at ON public.active_transfers;
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;

-- Supprimer les fonctions
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Supprimer les tables (CASCADE pour supprimer aussi les policies RLS dépendantes)
DROP TABLE IF EXISTS public.active_transfers CASCADE;
DROP TABLE IF EXISTS public.admin_logs CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Supprimer les index
DROP INDEX IF EXISTS idx_admin_logs_created_at;
DROP INDEX IF EXISTS idx_admin_logs_admin_id;
DROP INDEX IF EXISTS idx_messages_created_at;
DROP INDEX IF EXISTS idx_messages_receiver_id;
DROP INDEX IF EXISTS idx_messages_sender_id;
DROP INDEX IF EXISTS idx_transactions_created_at;
DROP INDEX IF EXISTS idx_transactions_user_id;

-- Supprimer le bucket storage avatars
DELETE FROM storage.buckets WHERE id = 'avatars';

-- ============================================================
-- PHASE 2 : RECONSTRUIRE LE SCHÉMA PROPRE
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table users
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
  balance DECIMAL(15, 2) NOT NULL DEFAULT 0,
  avatar_url TEXT,

  account_type TEXT NOT NULL DEFAULT 'CURRENT' CHECK (account_type IN ('CURRENT', 'SAVINGS')),
  card_number TEXT NOT NULL,
  card_expiry TEXT NOT NULL,
  card_cvc TEXT NOT NULL,
  joined_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  birth_date DATE NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country_code TEXT NOT NULL,
  country_name TEXT NOT NULL,
  country_flag TEXT NOT NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table transactions
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('CREDIT', 'DEBIT')),
  recipient_name TEXT NOT NULL,
  recipient_bank TEXT NOT NULL,
  recipient_iban TEXT NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table messages
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table admin_logs
CREATE TABLE public.admin_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  admin_name TEXT NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('BALANCE_UPDATE', 'USER_DELETION', 'SYSTEM')),
  target_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  target_user_name TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table active_transfers
CREATE TABLE public.active_transfers (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT FALSE,
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  is_paused BOOLEAN NOT NULL DEFAULT FALSE,
  required_code TEXT,
  recipient_name TEXT NOT NULL DEFAULT '',
  amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
  current_step_description TEXT NOT NULL DEFAULT '',
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Bucket storage avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- PHASE 3 : RLS (Row Level Security)
-- ============================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.active_transfers ENABLE ROW LEVEL SECURITY;

-- Users
CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can view all users for chat purposes" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can update any user" ON public.users FOR UPDATE USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN')) WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN'));
CREATE POLICY "Service role can insert users" ON public.users FOR INSERT WITH CHECK (true);

-- Transactions
CREATE POLICY "Users can view their own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own transactions" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can create transactions for any user" ON public.transactions FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN'));
CREATE POLICY "Admins can view all transactions" ON public.transactions FOR SELECT USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN'));

-- Messages
CREATE POLICY "Users can view messages they sent or received" ON public.messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update their received messages" ON public.messages FOR UPDATE USING (auth.uid() = receiver_id);

-- Admin logs
CREATE POLICY "Admins can view all logs" ON public.admin_logs FOR SELECT USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN'));
CREATE POLICY "Admins can create logs" ON public.admin_logs FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN'));

-- Active transfers
CREATE POLICY "Users can view their own active transfer" ON public.active_transfers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own active transfer" ON public.active_transfers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own active transfer" ON public.active_transfers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all active transfers" ON public.active_transfers FOR SELECT USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN'));

-- Storage
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload their own avatar" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update their own avatar" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own avatar" ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================================
-- PHASE 4 : INDEX
-- ============================================================

CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_created_at ON public.transactions(created_at DESC);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON public.messages(receiver_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX idx_admin_logs_admin_id ON public.admin_logs(admin_id);
CREATE INDEX idx_admin_logs_created_at ON public.admin_logs(created_at DESC);

-- ============================================================
-- PHASE 5 : FONCTION + TRIGGERS
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_active_transfers_updated_at BEFORE UPDATE ON public.active_transfers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- PHASE 6 : CRÉER L'UTILISATEUR ADMIN
-- ============================================================

DO $$
DECLARE
    admin_id UUID := 'a0000000-0000-0000-0000-000000000001';
    hashed_password TEXT;
BEGIN
    -- Générer le hash bcrypt du mot de passe "0123456789"
    -- Le format interne de Supabase : $2a$10$...
    hashed_password := '';
    BEGIN
        -- Essayer d'insérer directement dans auth.users
        -- Si auth.users existe déjà avec cet ID, mettre à jour
        INSERT INTO auth.users (
            id,
            instance_id,
            email,
            encrypted_password,
            email_confirmed_at,
            last_sign_in_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_sent_at,
            recovery_sent_at,
            new_sms_delivery,
            new_email_delivery,
            invite_sent_at,
            aud,
            role,
            is_sso_user,
            is_super_admin,
            encrypted_fields,
            provider,
            provider_id,
            phone,
            phone_confirmed_at,
            authenticator_data,
            internal_user,
            external_id,
            metadata,
            reauthentication_sent_at,
            metadata_null,
            avatar_url
        )
        VALUES (
            admin_id,
            '00000000-0000-0000-0000-000000000000'::UUID,
            'admin@azurbank.company',
            crypt('0123456789', gen_salt('bf', 10)),  -- hash bcrypt pour PostgreSQL
            NOW(),
            NULL,
            '{"provider":"email","providers":["email"]}'::JSONB,
            '{"name":"Super Administrator"}'::JSONB,
            NOW(),
            NOW(),
            NULL, NULL, NULL, NULL, NULL,
            'authenticated',
            NULL,
            false,
            false,
            NULL,
            'email',
            NULL,
            NULL,
            NULL,
            NULL,
            true,
            NULL,
            '{}'::JSONB,
            NULL,
            false,
            NULL
        )
        ON CONFLICT (id) DO UPDATE
        SET
            email = 'admin@azurbank.company',
            encrypted_password = crypt('0123456789', gen_salt('bf', 10)),
            email_confirmed_at = NOW(),
            raw_user_meta_data = '{"name":"Super Administrator"}'::JSONB,
            updated_at = NOW();

        RAISE NOTICE 'auth.users mis à jour (ID: %)', admin_id;
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE 'Impossible d''écrire dans auth.users : %. Procéder avec l''étape suivante.', SQLERRM;
    END;

    -- Créer/mettre à jour le profil dans public.users
    IF EXISTS (SELECT 1 FROM public.users WHERE id = admin_id) THEN
        UPDATE public.users SET
            name = 'Super Administrator',
            email = 'admin@azurbank.company',
            role = 'ADMIN',
            balance = 999999999,
            avatar_url = 'https://picsum.photos/200/200',
            account_type = 'CURRENT',
            card_number = '4111 1111 1111 1111',
            card_expiry = '12/99',
            card_cvc = '123',
            joined_date = NOW(),
            birth_date = '1980-01-01',
            phone = '+33 6 00 00 00 00',
            address = 'Admin HQ',
            postal_code = '75000',
            country_code = 'FR',
            country_name = 'France',
            country_flag = 'FR'
        WHERE id = admin_id;
        RAISE NOTICE 'Profil public.users mis à jour';
    ELSE
        INSERT INTO public.users (
            id, name, email, role, balance, avatar_url,
            account_type, card_number, card_expiry, card_cvc,
            joined_date, birth_date, phone, address, postal_code,
            country_code, country_name, country_flag
        ) VALUES (
            admin_id, 'Super Administrator', 'admin@azurbank.company',
            'ADMIN', 999999999, 'https://picsum.photos/200/200',
            'CURRENT', '4111 1111 1111 1111', '12/99', '123',
            NOW(), '1980-01-01', '+33 6 00 00 00 00',
            'Admin HQ', '75000', 'FR', 'France', 'FR'
        );
        RAISE NOTICE 'Profil public.users créé';
    END IF;
END $$;

-- ============================================================
-- PHASE 7 : VÉRIFICATION
-- ============================================================

SELECT 'users' AS table_name, COUNT(*) AS row_count FROM public.users
UNION ALL
SELECT 'transactions', COUNT(*) FROM public.transactions
UNION ALL
SELECT 'messages', COUNT(*) FROM public.messages
UNION ALL
SELECT 'admin_logs', COUNT(*) FROM public.admin_logs
UNION ALL
SELECT 'active_transfers', COUNT(*) FROM public.active_transfers;

COMMIT;
