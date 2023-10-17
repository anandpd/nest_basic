import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Logger } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Auth System (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('should handle signup request :[POST]: /auth/signup', () => {
        const email = "iamanand@yopmail.com";
        return request(app.getHttpServer())
            .post('/auth/signup')
            .send({ email: email, password: "password" })
            .then((response) => {
                expect(response.status).toBe(201);
                expect(response.body.data.user.id).toBeDefined();
                expect(response.body.data.user.email).toEqual(email);

            })
    });

    it('should signUp as new user and return currently logged in user', async () => {
        const email: string = "asdf@gmail.com";
        const pass: string = 'any';
        const res = await request(app.getHttpServer())
            .post('/auth/signup')
            .send({ email, password: pass });
        expect(res.status).toBe(201);
        expect(res.body.data.token).toBeDefined();

        const token = res.body.data.token;
        const { body } = await request(app.getHttpServer())
            .get('/auth/whoami')
            .set('token', token)
            .expect(200)
        expect(body.email).toEqual(email);
    })
});
