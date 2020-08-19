// import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
// import * as request from 'supertest';
// import { AppModule } from './../src/app.module';

// describe('AppController (e2e)', () => {
//   let app: INestApplication;

//   beforeEach(async () => {
//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [AppModule],
//     }).compile();

//     app = moduleFixture.createNestApplication();
//     await app.init();
//   });

//   it('/ (GET)', () => {
//     return request(app.getHttpServer())
//       .get('/')
//       .expect(200)
//       .expect('Hello World!');
//   });
// });

import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateProductDTO } from '../src/product/dto/create-product.dto';
import { Connection } from 'typeorm';

describe('AppController (e2e)', () => {
  let app: INestApplication
  let module: TestingModule;
  let connection: Connection;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    connection = module.get(Connection)
    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    module.close();
  })

  afterEach(async () => {
    await connection.synchronize(true)
  })

  it('/', () => {
    let productDTO = new CreateProductDTO()
    productDTO.name = "laptop";
    productDTO.description = "Dell"
    productDTO.price = "23000"
    return request(app.getHttpServer())
      .post('/')
      .send(productDTO)
      .expect(201)
      .expect({
        name: "laptop",
        description: "Dell",
        price: 23000
      });
  });
});
