import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  // Creamos un objeto falso que imita al UsersService real con todos los métodos que usa el Controller
  const mockUsersService = {
    getUsers: jest.fn().mockResolvedValue([{ id: '1', name: 'Miguel' }]),
    getUser: jest.fn().mockResolvedValue({ id: '1', name: 'Miguel' }),
    createUser: jest.fn().mockResolvedValue({ id: '2', name: 'Angel' }),
    updateUser: jest
      .fn()
      .mockResolvedValue({ id: '1', name: 'Miguel Actualizado' }),
    removeUser: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    // Configuramos el módulo de pruebas inyectando el mock del servicio
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService, // Inyectamos el mock en lugar del real es decir la base de datos de mongoDB
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  // --- Test de GET /users ---
  describe('getUsers', () => {
    it('debería retornar un arreglo de usuarios', async () => {
      const result = await controller.getUsers();

      expect(result).toEqual([{ id: '1', name: 'Miguel' }]);
      expect(service.getUsers).toHaveBeenCalled(); // Verificamos que se llamó al servicio
    });
  });

  describe('createUser', () => {
    it('debería crear un nuevo usuario', async () => {
      const dto = { name: 'Angel', email: 'a@a.com', password: '123' };
      const result = await controller.createUser(dto as any);

      expect(result).toEqual({ id: '2', name: 'Angel' });
      expect(service.createUser).toHaveBeenCalledWith(dto);
    });
  });
  // --- Test de GET /users/:id ---
  describe('getUser', () => {
    it('debería retornar un solo usuario por ID', async () => {
      const id = '1';
      const result = await controller.getUser(id);

      expect(result).toEqual({ id: '1', name: 'Miguel' });
      expect(service.getUser).toHaveBeenCalledWith(id);
    });
  });

  // --- Test de PUT /users/:id ---
  describe('updateUser', () => {
    it('debería actualizar un usuario y retornar el resultado', async () => {
      const id = '1';
      const dto = { name: 'Miguel Actualizado' };
      const result = await controller.updateUser(id, dto as any);

      expect(result).toEqual({ id: '1', name: 'Miguel Actualizado' });
      expect(service.updateUser).toHaveBeenCalledWith(id, dto);
    });
  });

  // --- Test de DELETE /users/:id ---
  describe('removeUser', () => {
    it('debería eliminar el usuario (retorna undefined/void)', async () => {
      const id = '1';
      const result = await controller.removeUser(id);

      expect(result).toBeUndefined();
      expect(service.removeUser).toHaveBeenCalledWith(id);
    });
  });

  // 3. Limpieza de los mocks después de cada test
  afterEach(() => {
    jest.clearAllMocks();
  });
});
