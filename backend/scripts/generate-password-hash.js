// backend/scripts/generate-password-hash.js
import bcrypt from 'bcrypt';

const password = 'Admin@123';
const saltRounds = 10;

async function generateHash() {
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    
    console.log('========================================');
    console.log('PASSWORD HASH GENERATOR');
    console.log('========================================');
    console.log('Password:', password);
    console.log('Salt Rounds:', saltRounds);
    console.log('');
    console.log('Generated Hash:');
    console.log(hash);
    console.log('');
    console.log('SQL UPDATE COMMAND:');
    console.log(`UPDATE user SET passwordHash = '${hash}' WHERE email = 'admin@sogas.sn';`);
    console.log('========================================');
  } catch (error) {
    console.error('Error generating hash:', error);
  }
}

generateHash();