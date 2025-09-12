import bcrypt from 'bcryptjs';

const generateHashes = async () => {
  console.log('Generating password hashes...');
  
  // Generate hash for "password"
  const passwordHash = await bcrypt.hash('password', 12);
  console.log('Hash for "password":', passwordHash);
  
  // Generate hash for "adminpassword" 
  const adminPasswordHash = await bcrypt.hash('adminpassword', 12);
  console.log('Hash for "adminpassword":', adminPasswordHash);
};

generateHashes();