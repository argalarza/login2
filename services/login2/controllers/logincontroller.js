const bcrypt = require('bcryptjs')
const axios = require('axios');
const { getUserByEmail } = require('../models/user');
const { verifyGoogleToken } = require('../services/googleAuth');
const { verifyFacebookToken } = require('../services/facebookAuth');
const { generateToken } = require('../config/jwt');

const loginUser = async (req, res) => {
  const { email, password, recaptchaToken, provider, oauthToken } = req.body;

  try {
    if (!recaptchaToken) {
      return res.status(400).json({ error: 'Falta el token de reCAPTCHA' });
    }

    const recaptchaResponse = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET,
          response: recaptchaToken,
        },
      }
    );

    if (!recaptchaResponse.data.success) {
      return res.status(400).json({ error: 'Falló la verificación de reCAPTCHA' });
    }

    let user;

    if (provider === 'google') {
      const payload = await verifyGoogleToken(oauthToken);
      user = await getUserByEmail(payload.email);
    } else if (provider === 'facebook') {
      const emailFromFB = await verifyFacebookToken(oauthToken);
      user = await getUserByEmail(emailFromFB);
    } else {
      if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña requeridos' });
      }

      user = await getUserByEmail(email);
      if (!user) return res.status(401).json({ error: 'Credenciales incorrectas' });

      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const token = generateToken(user);
    res.json({ message: 'Login exitoso', token, user });
  } catch (error) {
    console.error('Error en login:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { loginUser };
