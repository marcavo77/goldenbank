/**
 * Script pour créer l'utilisateur admin via l'API REST Supabase Auth Admin
 * NOUVEAU PROJET SUPABASE - Mai 2026
 */

const SUPABASE_URL = 'https://ctuwgcukaiuwfgryxaoh.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0dXdnY3VrYWl1d2Zncnl4YW9oIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzk2MTUxMSwiZXhwIjoyMDkzNTM3NTExfQ.kpZhkaeKF_zANrn0EjFkrKs7QMK81SqwivtX_FSU_dA';

const ADMIN_EMAIL = 'admin@azurbank.company';
const ADMIN_PASSWORD = '0123456789';
const ADMIN_NAME = 'Super Administrator';

async function main() {
  console.log('🔄 Création de l\'utilisateur admin sur le nouveau projet Supabase...\n');

  // 1. Vérifier si l'utilisateur existe déjà dans auth.users
  console.log('📋 Vérification des utilisateurs existants dans auth.users...');
  const listResp = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    headers: {
      'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'apikey': SUPABASE_SERVICE_ROLE_KEY,
    }
  });

  if (!listResp.ok) {
    const err = await listResp.text();
    console.error('❌ Erreur lors de la liste des utilisateurs:', err);
    process.exit(1);
  }

  const listData = await listResp.json();
  console.log('✅ Connexion auth fonctionne. Utilisateurs existants:', listData.users?.length || 0);

  const existingUser = listData.users?.find(u => u.email === ADMIN_EMAIL);

  let userId;
  if (existingUser) {
    console.log('⚠️  L\'utilisateur existe déjà dans auth.users:', existingUser.id);
    userId = existingUser.id;
  } else {
    // 2. Créer l'utilisateur via l'API Admin
    console.log('📝 Création du nouvel utilisateur admin...');
    const createResp = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        email_confirm: true,
        user_metadata: {
          name: ADMIN_NAME
        }
      })
    });

    if (!createResp.ok) {
      const err = await createResp.text();
      console.error('❌ Erreur lors de la création:', err);
      process.exit(1);
    }

    const userData = await createResp.json();
    userId = userData.id;
    console.log('✅ Utilisateur créé dans auth.users:', userId);
  }

  // 3. Créer le profil dans public.users
  console.log('\n📋 Création du profil dans public.users...');

  // Générer les données de carte
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

  const generateCVC = () => Math.floor(100 + Math.random() * 899).toString();

  const insertResp = await fetch(`${SUPABASE_URL}/rest/v1/users`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'apikey': SUPABASE_SERVICE_ROLE_KEY,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates'
    },
    body: JSON.stringify([{
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
      country_flag: 'FR'
    }])
  });

  const insertData = await insertResp.text();
  if (!insertResp.ok) {
    console.error('❌ Erreur lors de la création du profil:', insertData);
    process.exit(1);
  }

  console.log('✅ Profil créé/mis à jour dans public.users');

  // 4. Vérification finale
  console.log('\n🔍 Vérification...');
  const verifyResp = await fetch(
    `${SUPABASE_URL}/rest/v1/users?select=id,name,email,role,balance`,
    {
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
      }
    }
  );

  const verifyData = await verifyResp.json();
  console.log('📋 Utilisateurs dans public.users:', JSON.stringify(verifyData, null, 2));

  // 5. Tester la connexion
  console.log('\n🧪 Test de connexion...');
  const loginResp = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_SERVICE_ROLE_KEY,
    },
    body: JSON.stringify({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    })
  });

  const loginData = await loginResp.json();
  if (loginResp.ok && loginData.access_token) {
    console.log('✅✅✅ CONNEXION ADMIN RÉUSSIE !');
    console.log('\n🎉 SUCCÈS TOTAL! L\'utilisateur admin est fonctionnel!');
  } else {
    console.log('⚠️  Auth répond mais token non généré:', loginData);
  }

  console.log('\n📋 Informations de connexion:');
  console.log('   Email: admin@azurbank.company');
  console.log('   Mot de passe: 0123456789');
  console.log('\n🌐 URL de l\'application: azurbank.vercel.app');
}

main().catch(e => {
  console.error('❌ ERREUR:', e);
  process.exit(1);
});