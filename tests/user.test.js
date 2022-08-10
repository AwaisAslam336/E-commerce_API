const request = require('supertest');
const path = require('path');
const app = require('../app');
const {
    mongoConnect,
    mongoDisconnect,
} = require('../services/mongo');

describe('E commerce API', () => {
    beforeAll(async () => {
        await mongoConnect();
    });

    afterAll(async () => {
        await mongoDisconnect();
    });

    describe('Test POST /register', () => {
        const img = path.join(__dirname, '../public/storeImages/test_image.jpg');
        const randString = Math.random().toString(36).slice(2);
        
        test('It should respond with 201 created', async () => {

            const response = await request(app)
                .post('/api/user/register')
                .attach('image', img)
                .field('name', 'test name')
                .field('email', `${randString}@gmail.com`)
                .field('password', '1234')
                .field('type', '1')
                .field('mobile', '12345')
                .expect(201)

            console.log(response)
        });
    });

});