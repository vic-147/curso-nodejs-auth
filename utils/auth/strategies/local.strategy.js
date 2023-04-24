const { Strategy } = require('passport-local');

const AuthService = require('../../../services/auth.service');
const service = new AuthService();

const LocalStrategy = new Strategy(
  {
    // para personalizar los campos en la peticion
    usernameField: 'email',
    passwordField: 'password',
  },
  async (email, password, done) => {
    //para manejar errore se usa done
    try {
      const user = await service.getUser(email, password);
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
);

module.exports = LocalStrategy;
