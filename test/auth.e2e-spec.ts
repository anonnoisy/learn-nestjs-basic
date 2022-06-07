import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', () => {
		const email = 'e2e@example.com';
    return request(app.getHttpServer())
      .post('/auth/signup')
			.send({
				'email': email,
				'password': 'testing'
			})
      .expect(201)
      .then((response) => {
				const { id, email } = response.body;

				expect(id).toBeDefined();
				expect(email).toEqual(email);
			});
  });

  it('signup as a new user then get the currentky logged in', async () => {
		const email = 'e2e@example.com';
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
			.send({
				'email': email,
				'password': 'testing'
			})
      .expect(201);

      const cookie = res.get('Set-Cookie');

      const { body } = await request(app.getHttpServer())
        .get('/auth/whoami')
        .set('Cookie', cookie)
        .expect(200);

      expect(body.email).toEqual(email);
  });
});
