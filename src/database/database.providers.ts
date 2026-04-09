import { Provider } from '@nestjs/common';
import { Connection, connect } from 'mongoose';
import { ConfigService } from '@nestjs/config'; // Importar ConfigService

export const databaseProviders: Provider[] = [
  {
    provide: 'DATABASE_CONNECTION', 
    useFactory: async (configService: ConfigService): Promise<Connection> => {
      try {
        const uri = configService.get<string>('MONGODB_URI');
        
        if (!uri) {
          throw new Error('MONGODB_URI no está definida en el archivo .env');
        }

        const connection = await connect(uri);
        
        console.log('Conexión a MongoDB Atlas establecida correctamente');
        return connection.connection; 
      } catch (error) {
        console.error('Error conectando a MongoDB:', error);
        throw error;
      }
    },
    inject: [ConfigService], 
  },
];

// import * as mongoose from 'mongoose';

// export const databaseProviders = [
//   {
//     provide: 'DATABASE_CONNECTION',
//     useFactory: (): Promise<typeof mongoose> =>
//        mongoose.connect(process.env.MONGODB_URI!), // Tu variable de Atlas
//       // mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/test_db'),
//   },
// ];