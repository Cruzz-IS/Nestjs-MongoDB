import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import * as dotenv from 'dotenv';
import { UsersService } from 'src/users/users.service';

dotenv.config();

describe('Users Module (e2e)', () => {
  let app: INestApplication;
  let createdUserId: string;
  const authHeader = 'xyz123';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // whitelist este se asegura que solo pasen los datos definidos en el DTO es decir las validaciones se cumplan
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();

    // Borrar todos los usuarios antes de empezar los tests
    const userService = moduleFixture.get(UsersService);
    await userService['userModel'].deleteMany({});
  });

  it('/users (POST) - Error 400 por email inválido', () => {
    return request(app.getHttpServer())
      .post('/users')
      .set('Authorization', authHeader)
      .send({
        name: 'Miguel',
        email: 'no-es-email',
        password: '123',
        age: 25,
      })
      .expect(400);
  });

  describe('Flujo Completo de Usuario', () => {
    it('Debería crear un usuario (POST)', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', authHeader)
        .send({
          name: 'Miguel E2E',
          email: `test_${Date.now()}@unah.hn`,
          password: 'password123', 
          age: 22, 
        })
        .expect(201);

      createdUserId = response.body._id;
      expect(createdUserId).toBeDefined();
    });

    it('Debería obtener el usuario creado (GET /:id)', () => {
      return request(app.getHttpServer())
        .get(`/users/${createdUserId}`)
        .set('Authorization', authHeader)
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe('Miguel E2E');
          expect(res.body.age).toBe(22);
        });
    });

    it('Debería actualizar el usuario (PUT /:id)', () => {
      // Como UpdateUserDto es PartialType, aquí sí podemos enviar solo un campo similar a un PATCH
      return request(app.getHttpServer())
        .put(`/users/${createdUserId}`)
        .set('Authorization', authHeader)
        .send({ name: 'Miguel Actualizado' })
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe('Miguel Actualizado');
        });
    });

    it('Debería eliminar el usuario (DELETE /:id)', () => {
      return request(app.getHttpServer())
        .delete(`/users/${createdUserId}`)
        .set('Authorization', authHeader)
        .expect(204);
    });
  });

  afterAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const userService = moduleFixture.get(UsersService);
    // Borramos los usuarios creados por los tests
    await userService['userModel'].deleteMany({
      email: { $regex: /@example\.com|@test\.com/i },
    });

    await app.close();
  });
});
