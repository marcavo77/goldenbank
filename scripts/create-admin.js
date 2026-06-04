/**
 * Script pour créer l'utilisateur admin dans Supabase
 * 
 * Instructions:
 * 1. Récupérez votre SERVICE_ROLE_KEY dans Supabase Dashboard > Settings > API
 * 2. Exécutez ce script avec: node scripts/create-admin.js
 * 
 * OU créez l'utilisateur manuellement dans Supabase Dashboard puis exécutez seulement la requête SQL
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charger les variables d'environnement
dotenv.config({ path: join(__dirname, '../.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://hjpgwitgyuzhtdljvnit.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ ERREUR: SUPABASE_SERVICE_ROLE_KEY n\'est pas définie dans .env');
  console.log('\n📝 Pour créer l\'utilisateur admin manuellement:');
  console.log('1. Allez dans Supabase Dashboard > Authentication > Users');
  console.log('2. Cliquez sur "Add user" > "Create new user"');
  console.log('3. Email: admin@azurbank.company');
  console.log('4. Password: 012345678');
  console.log('5. Désactivez "Auto Confirm User"');
  console.log('6. Après création, exécutez le SQL dans create-admin.sql\n');
  process.exit(1);
}

// Créer le client avec service_role (permissions admin)
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const ADMIN_EMAIL = 'admin@azurbank.company';
const ADMIN_PASSWORD = '0123456789';
const ADMIN_NAME = 'Super Administrator';

async function createAdminUser() {
  try {
    console.log('🔄 Création de l\'utilisateur admin...\n');

    // 1. Créer l'utilisateur dans Supabase Auth
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true, // Confirmer automatiquement l'email
      user_metadata: {
        name: ADMIN_NAME
      }
    });

    if (authError) {
      // Si l'utilisateur existe déjà
      if (authError.message.includes('already registered') || authError.message.includes('already exists')) {
        console.log('⚠️  L\'utilisateur existe déjà dans Auth. Récupération des informations...');
        
        // Récupérer l'utilisateur existant
        const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();
        if (listError) throw listError;
        
        const existingUser = existingUsers.users.find(u => u.email === ADMIN_EMAIL);
        if (!existingUser) {
          throw new Error('Utilisateur trouvé mais impossible de récupérer les détails');
        }
        
        authUser.user = existingUser;
        console.log('✅ Utilisateur existant trouvé:', authUser.user.id);
      } else {
        throw authError;
      }
    } else {
      console.log('✅ Utilisateur créé dans Auth:', authUser.user.id);
    }

    const userId = authUser.user.id;

    // 2. Vérifier si l'utilisateur existe déjà dans la table users
    const { data: existingProfile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (existingProfile) {
      console.log('⚠️  Le profil existe déjà. Mise à jour du rôle en ADMIN...');
      
      const { error: updateError } = await supabaseAdmin
        .from('users')
        .update({ role: 'ADMIN' })
        .eq('id', userId);

      if (updateError) throw updateError;
      console.log('✅ Rôle mis à jour en ADMIN');
    } else {
      // 3. Générer les données de carte
      const generateCardNumber = () => {
        const parts = [];
        for (let i = 0; i < 4; i++) {
          parts.push(Math.floor(1000 + Math.random() * 9000).toString());
        }
        return parts.join(' ');
      };

      const generateExpiry = () => {
        const now = new Date();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const year = (now.getFullYear() + 5).toString().slice(-2);
        return `${month}/${year}`;
      };

      const generateCVC = () => {
        return Math.floor(100 + Math.random() * 899).toString();
      };

      // 4. Créer le profil dans la table users
      const { error: insertError } = await supabaseAdmin
        .from('users')
        .insert([{
          id: userId,
          name: ADMIN_NAME,
          email: ADMIN_EMAIL,
          role: 'ADMIN',
          balance: '999999999',
          avatar_url: 'https://picsum.photos/200/200',
          account_type: 'CURRENT',
          card_number: generateCardNumber(),
          card_expiry: generateExpiry(),
          card_cvc: generateCVC(),
          joined_date: new Date().toISOString(),
          birth_date: '1980-01-01',
          phone: '+33 6 00 00 00 00',
          address: 'Admin HQ',
          postal_code: '75000',
          country_code: 'FR',
          country_name: 'France',
          country_flag: '🇫🇷'
        }]);

      if (insertError) {
        // Si l'erreur est due à une contrainte, essayer de mettre à jour
        if (insertError.code === '23505') { // Violation de contrainte unique
          console.log('⚠️  Le profil existe déjà. Mise à jour...');
          const { error: updateError } = await supabaseAdmin
            .from('users')
            .update({ role: 'ADMIN' })
            .eq('id', userId);
          if (updateError) throw updateError;
        } else {
          throw insertError;
        }
      }

      console.log('✅ Profil créé dans la table users');
    }

    console.log('\n🎉 SUCCÈS! L\'utilisateur admin a été créé avec succès!');
    console.log('\n📋 Informations de connexion:');
    console.log('   Email: admin@azurbank.company');
    console.log('   Mot de passe: 012345678');
    console.log('\n✅ Vous pouvez maintenant vous connecter à l\'application!');

  } catch (error) {
    console.error('\n❌ ERREUR:', error.message);
    if (error.details) console.error('Détails:', error.details);
    process.exit(1);
  }
}

createAdminUser();

