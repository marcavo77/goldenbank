/**
 * Script pour créer l'utilisateur admin via l'API REST Supabase Auth Admin
 * Utilise fetch natif de Node.js 18+
 */

const SUPABASE_URL = 'https://lxtgrywmfrysydiagaxe.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4dGdyeXdtZnJ5c3lkaWFnYXhlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzcwOTQ0MSwiZXhwIjoyMDkzMjg1NDQxfQ.Yj9GiW2mfE3A3GLZ7MAscNgeIkH0CQN8D_yEsPKuWrk';

const ADMIN_EMAIL = 'admin@azurbank.company';
const ADMIN_PASSWORD = '0123456789';
const ADMIN_NAME = 'Super Administrator';

async function main() {
  console.log('🔄 Création de l\'utilisateur admin via API REST...\n');

  // 1. Vérifier si l'utilisateur existe déjà dans auth.users
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
  const existingUser = listData.users?.find(u => u.email === ADMIN_EMAIL);

  let userId;
  if (existingUser) {
    console.log('⚠️  L\'utilisateur existe déjà dans auth.users:', existingUser.id);
    userId = existingUser.id;
  } else {
    // 2. Créer l'utilisateur via l'API Admin
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

  // 3. Vérifier/mettre à jour le profil dans public.users
  const checkResp = await fetch(
    `${SUPABASE_URL}/rest/v1/users?id=eq.${userId}&select=id,role`,
    {
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Prefer': 'resolution=merge-duplicates'
      }
    }
  );

  const checkData = await checkResp.json();
  console.log('📋 Profil public.users:', JSON.stringify(checkData));

  if (checkData.length === 0) {
    // Créer le profil
    const insertResp = await fetch(`${SUPABASE_URL}/rest/v1/users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify([{
        id: userId,
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        role: 'ADMIN',
        balance: '999999999',
        avatar_url: 'https://picsum.photos/200/200',
        account_type: 'CURRENT',
        card_number: '0000 0000 0000 0000',
        card_expiry: '12/99',
        card_cvc: '000',
        joined_date: new Date().toISOString(),
        birth_date: '1980-01-01',
        phone: '+33 6 00 00 00 00',
        address: 'Admin HQ',
        postal_code: '75000',
        country_code: 'FR',
        country_name: 'France',
        country_flag: '🇫🇷'
      }])
    });

    if (!insertResp.ok) {
      const err = await insertResp.text();
      console.error('❌ Erreur lors de la création du profil:', err);
      process.exit(1);
    }

    const inserted = await insertResp.json();
    console.log('✅ Profil créé dans public.users:', inserted);
  } else {
    // Mettre à jour le rôle en ADMIN
    const updateResp = await fetch(
      `${SUPABASE_URL}/rest/v1/users?id=eq.${userId}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          role: 'ADMIN',
          name: ADMIN_NAME,
          email: ADMIN_EMAIL,
          balance: '999999999'
        })
      }
    );

    if (!updateResp.ok) {
      const err = await updateResp.text();
      console.error('❌ Erreur lors de la mise à jour:', err);
      process.exit(1);
    }
    console.log('✅ Profil mis à jour en ADMIN');
  }

  console.log('\n🎉 SUCCÈS! L\'utilisateur admin est prêt!');
  console.log('\n📋 Informations de connexion:');
  console.log('   Email: admin@azurbank.company');
  console.log('   Mot de passe: 0123456789');
}

main().catch(e => {
  console.error('❌ ERREUR:', e);
  process.exit(1);
});
