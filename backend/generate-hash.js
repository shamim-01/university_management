import bcrypt from 'bcryptjs';

// আপনার পাসওয়ার্ড দিন
const password = 'admin123';

const salt = await bcrypt.genSalt(10);
const hash = await bcrypt.hash(password, salt);

console.log('====================================');
console.log('📧 Password:', password);
console.log('🔑 Hash:', hash);
console.log('====================================');
console.log('\n📋 MongoDB Compass এ এই Hash ব্যবহার করুন:');
console.log(hash);

process.exit(0);
