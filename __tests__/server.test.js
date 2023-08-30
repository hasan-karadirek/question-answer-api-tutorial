const app = require('../server.js');
const supertest = require('supertest');
const connectDatabase = require('../helpers/database/connectDatabase.js');

describe('API Register - End point /api/auth/register', () => {
  try {
    beforeAll(async () => {
      // Ensure the database is connected before running tests
      await connectDatabase();
      return;
    });

    it(' Should register user successfully', async () => {
      const timestamp = Date.now().toString();
      const data = {
        name: timestamp,
        email: `${timestamp}@gmail.com`,
        password: '123456',
      };

      await supertest(app)
        .post('/api/auth/register')
        .send(data)
        .expect(201)
        .then((res) => {
          expect(!res.body.access_token).toBe(false);
          expect(res.body.data.user).toEqual(data.name);
          expect(res.body.data.email).toEqual(data.email);
          return;
        });
    });

    it(' Should not register user with already registered email.', async () => {
      const timestamp = Date.now().toString();
      const data = {
        name: timestamp,
        email: `${timestamp}@gmail.com`,
        password: '123456',
      };
      await supertest(app).post('/api/auth/register').send(data).expect(201);

      await supertest(app)
        .post('/api/auth/register')
        .send(data)
        .expect(400)
        .then((res) => {
          expect(res.body.success).toBe(false);
          return;
        });
    });
    it(' Should not register user with missing infos.', async () => {
      const timestamp = Date.now().toString();
      const data = [
        {
          email: `${timestamp}@gmail.com`,
          password: '123456',
        },
        {
          name: timestamp,
          password: '123456',
        },
        {
          name: timestamp,
          email: `${timestamp}@gmail.com`,
        },
      ];
      const request = supertest(app).post('/api/auth/register');

      await request.send(data[0]).expect(400);
      await request.send(data[1]).expect(400);
      await request.send(data[2]).expect(400);
    });
  } catch (error) {
    console.error(error);
  }
});

describe('API Register - End point /api/auth/login - /logout', () => {
  const request = supertest(app);
  const timestamp = Date.now().toString();
  const data = {
    name: timestamp,
    email: `${timestamp}@gmail.com`,
    password: '123456',
  };
  try {
    beforeAll(async () => {
      // Ensure the database is connected before running tests
      await connectDatabase();
      console.log(data);
      await request.post('/api/auth/register').send(data).expect(201);
    });

    it(' Should login user successfully', async () => {
      console.log(data);
      await request
        .post('/api/auth/login')
        .send({ email: data.email, password: data.password })
        .expect(200)
        .then((res) => {
          const access_token = decodeURIComponent(res.headers['set-cookie'])
            .split(';')
            .filter((cookie) => cookie.split('=')[0] === 'access_token')[0]
            .split('=')[1];
          expect(!access_token).toBe(false);
          expect(res.body.data.user).toEqual(data.name);
          expect(res.body.data.email).toEqual(data.email);
          expect(!res.body.access_token).toBe(false);
          data.access_token = res.body.access_token;

          return;
        });
    });
    it(' Should not login user with missing infos', async () => {
      await request
        .post('/api/auth/login')
        .send({ email: data.email })
        .expect(400);
      await request
        .post('/api/auth/login')
        .send({ email: data.password })
        .expect(400);
    });
    it(' Should logout user ', async () => {
      await request
        .get('/api/auth/logout')
        .set('Authorization', data.access_token)
        .expect(200)
        .then((res) => {
          const access_token = decodeURIComponent(res.headers['set-cookie'])
            .split(';')
            .filter((cookie) => cookie.split('=')[0] === 'access_token')[0]
            .split('=')[1];
          expect(access_token).toEqual('');
          return;
        });
    });
    it(' Should logout user fail due to authorization (missing token) ', async () => {
      await request.get('/api/auth/logout').expect(401);
    });
  } catch (error) {
    console.error(error);
  }
});
