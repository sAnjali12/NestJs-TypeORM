import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as supertest from 'supertest';
import { Repository } from 'typeorm';

import { Product } from '../src/product/product.entity';
import { ProductModule } from '../src/product/product.module';

describe('User', () => {
  let app: INestApplication;
  let repository: Repository<Product>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ProductModule,
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'root',
          password: 'sAnjali21',
          database: 'product',
          entities: ['./**/*.entity.ts'],
          synchronize: true,
        }),
      ],
    }).compile();

    app = module.createNestApplication();
    repository = module.get('UserRepository');
    await app.init();
  });

  afterEach(async () => {
    await repository.query(`DELETE FROM users;`);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /users', () => {
    it('should return an array of users', async () => {
      await repository.save([{ name: 'test-name-0' }, { name: 'test-name-1' }]);
      const { body } = await supertest
        .agent(app.getHttpServer())
        .get('/all')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);
      expect(body).toEqual([
        {name: 'test-name-0', description: 'test-0', 'price': '0000' },
        {name: 'test-name-1', description: 'test-1', price: '1111' },
      ]);
    });
  });

  describe('POST /create', () => {
    it('should return a product', async () => {
      const { body } = await supertest
        .agent(app.getHttpServer())
        .post('/create')
        .set('Accept', 'application/json')
        .send({ name: 'laptop', description: 'Dell', price: '20000' })
        .expect('Content-Type', /json/)
        .expect(201);
      expect(body).toEqual({  name: 'laptop', description: 'Dell', price: '20000'});
    });

    it('should create a user is the DB', async () => {
      await expect(repository.findAndCount()).resolves.toEqual([[], 0]);
      await supertest
        .agent(app.getHttpServer())
        .post('/users')
        .set('Accept', 'application/json')
        .send({ name: 'test-name' })
        .expect('Content-Type', /json/)
        .expect(201);
      await expect(repository.findAndCount()).resolves.toEqual([
        [{ id: expect.any(Number), name: 'test-name' }],
        1,
      ]);
    });

    it('should handle a missing name', async () => {
      await supertest
        .agent(app.getHttpServer())
        .post('/users')
        .set('Accept', 'application/json')
        .send({ none: 'test-none' })
        .expect('Content-Type', /json/)
        .expect(500);
    });
  });
});
