-- Script pour confirmer l'email de l'utilisateur admin
-- À exécuter dans SQL Editor de Supabase

-- 1. Vérifier si l'utilisateur existe dans auth.users
SELECT 
    id,
    email,
    email_confirmed_at,
    confirmed_at,
    created_at
FROM auth.users
WHERE email = 'admin@azurbank.company';

-- 2. Confirmer l'email de l'utilisateur admin
-- Note: confirmed_at est une colonne générée, on ne peut mettre à jour que email_confirmed_at
UPDATE auth.users
SET 
    email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
    updated_at = NOW()
WHERE email = 'admin@azurbank.company';

-- 3. Vérifier que tout est correct
SELECT 
    u.id,
    u.name,
    u.email,
    u.role,
    u.balance,
    au.email_confirmed_at,
    au.confirmed_at  -- Cette colonne sera automatiquement mise à jour car elle est générée
FROM public.users u
LEFT JOIN auth.users au ON u.id = au.id
WHERE u.email = 'admin@azurbank.company';
