const bcrypt = require('bcrypt');

async function verifyPassword() {
  const password = 'yumyum#r';
  const hash = '$2b$10$pNS7TJPz8uYQY31WG47xf.VFOAnRmfwO8hKJGNw/NnmelgtdqP242';
  const verify = await bcrypt.compare(password, hash);
  console.log(verify);
}

verifyPassword();
