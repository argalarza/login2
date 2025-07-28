const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

jest.mock('../models/user', () => ({
  getUserByEmail: jest.fn()
}));
jest.mock('bcryptjs', () => ({
  compare: jest.fn()
}));
jest.mock('../config/jwt', () => ({
  generateToken: jest.fn()
}));
jest.mock('axios', () => ({
  post: jest.fn().mockResolvedValue({ data: { success: true } }) // evita reCAPTCHA real
}));

const { getUserByEmail } = require('../models/user');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../config/jwt');
const { loginUser } = require('../controllers/logincontroller');

const app = express();
app.use(bodyParser.json());
app.post('/auth/login', loginUser);

describe('🚀 Pruebas  de login local', () => {
  test('Login exitoso con email y password', async () => {
    getUserByEmail.mockResolvedValue({ id: 1, email: 'test@mail.com', password_hash: 'hash' });
    bcrypt.compare.mockResolvedValue(true);
    generateToken.mockReturnValue('mock-token');

    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@mail.com',
        password: '123456',
        recaptchaToken: 'fake'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBe('mock-token');
  });

  test('Error si usuario no existe', async () => {
    getUserByEmail.mockResolvedValue(null);

    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'no@mail.com',
        password: '123',
        recaptchaToken: 'fake'
      });

    expect(res.statusCode).toBe(401);
  });

  test('Error si password incorrecto', async () => {
    getUserByEmail.mockResolvedValue({ id: 1, email: 'test@mail.com', password_hash: 'hash' });
    bcrypt.compare.mockResolvedValue(false);

    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@mail.com',
        password: 'wrongpass',
        recaptchaToken: 'fake'
      });

    expect(res.statusCode).toBe(401);
  });
});
