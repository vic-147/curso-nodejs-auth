const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const UserService = require('./user.service');
const { config } = require('../config/config');

const service = new UserService();

class AuthService {
  async getUser(email, password) {
    const user = await service.findByEmail(email);
    if (!user) {
      throw boom.unauthorized();
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      throw boom.unauthorized();
    }
    delete user.dataValues.password;
    return user;
  }

  singToken(user) {
    const payload = {
      sub: user.id,
      role: user.role,
    };
    const token = jwt.sign(payload, config.jwtSecret);
    return token;
  }

  async sendRecovery(email) {
    // create reusable transporter object using the default SMTP transport
    const user = await service.findByEmail(email);
    if (!user) {
      throw boom.unauthorized();
    }
    const payload = { sub: user.id };
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '15min' });
    const link = `https://myfrontend.com/recovery?token=${token}`;
    await service.update(user.id, { recoveryToken: token });
    const mail = {
      from: 'jason.watsica86@ether', // sender address
      to: `${user.email}`, // list of receivers
      subject: 'Email para recuperar contraseña ✔', // Subject line
      html: `<b>Ingresa en el link -> </b>${link}`, // html body
    };
    const rta = await this.sendEmail(mail);
    return rta;
  }

  async sendEmail(infoMail) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      secure: false,
      port: 587,
      auth: {
        // varible de entorno config.
        user: config.mailUser,
        pass: config.mailPassword,
      },
    });
    // send mail with defined transport object
    await transporter.sendMail(infoMail);
    return { message: 'sent email succeful' };
  }

  async changePassword(token, newPassword) {
    try {
      const payload = jwt.verify(token, config.jwtSecret);
      const user = await service.findOne(payload.sub);
      if (user.recoveryToken !== token) {
        throw boom.unauthorized();
      }
      const hash = await bcrypt.hash(newPassword, 10);
      await service.update(user.id, {recoveryToken: null, password: hash});
      return { message: 'password has change' };
    } catch (error) {
      throw boom.unauthorized();
    }
  }
}

module.exports = AuthService;
