import { authService } from './src/services/auth.service.js';

async function testLogin() {
  console.log('🔍 Test login avec admin@sogas.sn...');
  
  try {
    const result = await authService.login('admin@sogas.sn', 'Admin@123');
    console.log('✅ Login réussi !');
    console.log('User:', result.user.email);
    console.log('Roles:', result.user.roles);
    console.log('Permissions:', result.user.permissions.length);
  } catch (error: any) {
    console.error('❌ Erreur login:', error.message);
    console.error('Stack:', error.stack);
  }
}

testLogin();