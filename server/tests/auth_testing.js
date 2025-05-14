const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server'); 
const User = require('../models/userModel');

let mongoServer;
let token;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
});

afterEach(async () => {
    await User.deleteMany();
});

describe('Auth Routes', () => {
    const userPayload = {
        username: 'testuser',
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
    };

    test('Register - success', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send(userPayload)
            .expect(201);

        expect(res.body).toHaveProperty('token');
        expect(res.body.user.email).toBe(userPayload.email);
    });

    test('Login - success', async () => {
        await request(app).post('/api/auth/register').send(userPayload);

        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: userPayload.email,
                password: userPayload.password
            })
            .expect(200);

        expect(res.body).toHaveProperty('token');
        token = res.body.token;
    });

    test('GetMe - success', async () => {
        await request(app).post('/api/auth/register').send(userPayload);
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: userPayload.email,
                password: userPayload.password
            });
        const token = loginRes.body.token;

        const res = await request(app)
            .get('/api/auth/me')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(res.body).toHaveProperty('email', userPayload.email);
    });

    test('Logout - success', async () => {
        await request(app).post('/api/auth/register').send(userPayload);
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: userPayload.email,
                password: userPayload.password
            });
        const token = loginRes.body.token;

        await request(app)
            .post('/api/auth/logout')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
    });
});
