const bcrypt = require('bcrypt');

async function hashPassword() {
  const pasword = 'yumyum#r';
  const hash = await bcrypt.hash(pasword, 10);
  console.log(hash);
}

hashPassword();
