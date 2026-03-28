import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let module: TestingModule;

  /**
   * 1. Definimos el Mock como una FUNCIÓN de Jest.
   * Esto permite que en el servicio funcione el: new this.userModel(...)
   */
  const mockUserModel: any = jest.fn().mockImplementation((dto) => ({
    ...dto,
    save: jest.fn().mockResolvedValue({ _id: 'uuid-123', ...dto }),
  }));

  /**
   * se agregan los métodos estáticos al Mock como find, findById, etc.
   * Mongoose requiere que estos métodos existan en la "clase" del modelo.
   */
  mockUserModel.find = jest.fn().mockReturnValue({
    lean: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue([{ name: 'Miguel', email: 'm@m.com' }]),
    }),
  });

  mockUserModel.findById = jest.fn();
  mockUserModel.findByIdAndUpdate = jest.fn();
  mockUserModel.findByIdAndDelete = jest.fn();

  beforeEach(async () => {
    // Inyectamos el Mock en el contenedor de NestJS
    module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'USER_MODEL', // Token de tu database provider
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- Test de Creación ---
  describe('createUser', () => {
    it('debería lanzar un ConflictException si el email ya existe', async () => {
      /**
       * Simulamos el fallo de duplicado (Error 11000).
       */
      mockUserModel.mockImplementationOnce(() => ({
        save: jest.fn().mockRejectedValue({ code: 11000 }),
      }));

      await expect(
        service.createUser({
          name: 'Miguel',
          email: 'test@test.com',
          password: '123',
        } as any),
      ).rejects.toThrow(ConflictException);
    });

    it('debería hashear la contraseña y guardar el usuario', async () => {
      const dto = { name: 'Miguel', email: 'm@m.com', password: '123' };

      /**
       * Simulamos una prueba  éxitosa.
       * Al usar mockImplementationOnce nos aseguramos de no usar el error del test anterior.
       */
      mockUserModel.mockImplementationOnce((data) => ({
        ...data,
        save: jest.fn().mockResolvedValue({ _id: 'uuid-123', ...data }),
      }));

      const result = await service.createUser(dto as any);

      // Verificaciones de seguridad y lógica
      expect(result.password).not.toBe('123'); // Bcrypt debe haber hecho su trabajo
      expect(result.email).toBe(dto.email);
    });
  });

  // --- Test de Búsqueda ---
  describe('getUsers', () => {
    it('debería retornar una lista de usuarios', async () => {
      // Configuramos el mock para que find().lean().exec() devuelva un arreglo
      const mockList = [{ name: 'Miguel', email: 'm@m.com' }];
      mockUserModel.find.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockList),
        }),
      });

      const result = await service.getUsers();
      expect(result).toEqual(mockList);
      expect(mockUserModel.find).toHaveBeenCalled();
    });
  });

  // --- 2. Test de Obtener UN usuario  ---
  describe('getUser', () => {
    it('debería retornar un usuario si existe', async () => {
      const mockUser = { _id: '123', name: 'Miguel' };
      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.getUser('123');
      expect(result).toEqual(mockUser);
    });

    it('debería lanzar NotFoundException si el ID no existe', async () => {
      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.getUser('id-falso')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // --- 3. Test de Actualizar Usuario ---
  describe('updateUser', () => {
    it('debería actualizar y retornar el usuario actualizado', async () => {
      const updateDto = { name: 'Miguel Actualizado' };
      const updatedUser = { _id: '123', ...updateDto };

      // Simulamos findByIdAndUpdate().setOptions().exec()
      // O solo findByIdAndUpdate().exec() según como lo tengas en el service
      mockUserModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedUser),
      });

      const result = await service.updateUser('123', updateDto as any);
      expect(result.name).toEqual('Miguel Actualizado');
      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalled();
    });

    it('debería lanzar NotFoundException si el usuario a actualizar no existe', async () => {
      mockUserModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.updateUser('id-falso', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // --- 4. Test de Eliminar Usuario ---
describe('removeUser', () => {
  it('debería eliminar un usuario exitosamente', async () => {
    // Definimos el valor que el MOCK debe devolver
    // Si tu servicio devuelve { deleted: true }, configuramos el mock para eso
    const mockResponse = { deleted: true };
    
    mockUserModel.findByIdAndDelete.mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockResponse),
    });

    //  Ejecutamos el método del servicio
    const result = await service.removeUser('123');

    //  Validamos que el resultado sea el esperado
    expect(result).toEqual(mockResponse); 
    expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith('123');
  });
});

  /**
   *  Limpieza post-pruebas.
   * Evita fugas de memoria y que los mocks retengan estados de tests anteriores.
   */
  afterAll(async () => {
    jest.clearAllMocks();
    await module.close();
  });
});
