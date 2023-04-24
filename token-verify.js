const jwt = require('jsonwebtoken');

const secret = 'mySecret';

// token no deberia estar aqui
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTY4MjAyNzkyM30.jpQMBTunM7XE2Mg6QEbmBaxh3wXNTa9gz1EtjwZFXdQ';

function verifyToken(token, secret) {
  return jwt.verify(token, secret);
}

const payload = verifyToken(token, secret);
console.log(payload);
