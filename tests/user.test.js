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

    const randString = Math.random().toString(36).slice(2);

    describe('Test POST /register', () => {
        const img = path.join(__dirname, '../public/storeImages/test_image.jpg');

        test('It should respond with 201 created and success is true', async () => {

            const response = await request(app)
                .post('/api/user/register')
                //.attach('image', img)
                .field('name', 'test name')
                .field('email', `${randString}@gmail.com`)
                .field('password', '1234')
                .field('type', '1')
                .field('mobile', '12345')
                .expect(201)

            expect(response.body.success).toBe(true);
            
        });
    });

    // describe('Test POST /login', () => {

    //     test('It should respond with 200 and a accessToken', async () => {

    //         const response = await request(app)
    //             .post('/api/user/login')
    //             .send({
    //                 email: `${randString}@gmail.com`,
    //                 password: '1234',
    //             })
    //             .expect(200)
    //         expect(response.body && response.body.success).toBe(true);
    //         expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    //         expect(response.body.accessToken).toBeDefined();
    //     });
    // });

});