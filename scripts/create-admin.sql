-- Script SQL pour créer/mettre à jour l'utilisateur admin
-- À exécuter APRÈS avoir créé l'utilisateur dans Supabase Auth (Authentication > Users)
-- 
-- Instructions:
-- 1. Allez dans Supabase Dashboard > Authentication > Users
-- 2. Cliquez sur "Add user" > "Create new user"
-- 3. Email: admin@azurbank.company
-- 4. Password: 0123456789
-- 5. Désactivez "Auto Confirm User" si nécessaire, puis confirmez manuellement
-- 6. Copiez l'UUID de l'utilisateur créé
-- 7. Remplacez 'USER_UUID_HERE' dans ce script par l'UUID de l'utilisateur
-- 8. Exécutez ce script dans SQL Editor

-- Si vous connaissez l'UUID, utilisez cette requête (remplacez USER_UUID_HERE):
-- Sinon, la requête suivante trouvera l'utilisateur par email
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Trouver l'utilisateur par email dans auth.users
    SELECT id INTO admin_user_id
    FROM auth.users
    WHERE email = 'admin@azurbank.company'
    LIMIT 1;

    IF admin_user_id IS NULL THEN
        RAISE EXCEPTION 'Utilisateur admin@azurbank.company non trouvé dans auth.users. Créez-le d''abord dans Authentication > Users';
    END IF;

    -- Vérifier si le profil existe déjà
    IF EXISTS (SELECT 1 FROM public.users WHERE id = admin_user_id) THEN
        -- Mettre à jour le rôle
        UPDATE public.users
        SET 
            role = 'ADMIN',
            name = 'Super Administrator',
            email = 'admin@azurbank.company',
            balance = '999999999'
        WHERE id = admin_user_id;
        
        RAISE NOTICE 'Profil admin mis à jour avec succès (ID: %)', admin_user_id;
    ELSE
        -- Créer le profil
        INSERT INTO public.users (
            id,
            name,
            email,
            role,
            balance,
            avatar_url,
            account_type,
            card_number,
            card_expiry,
            card_cvc,
            joined_date,
            birth_date,
            phone,
            address,
            postal_code,
            country_code,
            country_name,
            country_flag
        ) VALUES (
            admin_user_id,
            'Super Administrator',
            'admin@azurbank.company',
            'ADMIN',
            '999999999',
            'https://picsum.photos/200/200',
            'CURRENT',
            '0000 0000 0000 0000',
            '12/99',
            '000',
            NOW(),
            '1980-01-01',
            '+33 6 00 00 00 00',
            'Admin HQ',
            '75000',
            'FR',
            'France',
            '🇫🇷'
        );
        
        RAISE NOTICE 'Profil admin créé avec succès (ID: %)', admin_user_id;
    END IF;
END $$;

-- Vérifier que tout est correct
SELECT 
    id,
    name,
    email,
    role,
    balance
FROM public.users
WHERE email = 'admin@novabank.com';

