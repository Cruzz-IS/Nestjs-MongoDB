import {
  MiddlewareConsumer,
  Module,
  NestMiddleware,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { LoggerMiddleware } from './logger/logger.middleware';
import { AuthMiddleware } from './auth/auth.middleware';
import { DatabaseModule } from 'src/database/database.module';
import { usersProviders } from './users.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [UsersService, ...usersProviders],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware) //Aqui se aplica el middleware para utilizarla en las rutas en las que se le indique
      .forRoutes(
        { path: '/users', method: RequestMethod.GET },
        {
          path: '/users',
          method: RequestMethod.POST,
        },
      )
      .apply(AuthMiddleware)
      .forRoutes('users');
  }
}

// import {
//   MiddlewareConsumer,
//   Module,
//   NestMiddleware,
//   NestModule,
//   RequestMethod,
// } from '@nestjs/common';
// import { UsersController } from './users.controller';
// import { UsersService } from './users.service';
// import { LoggerMiddleware } from './logger/logger.middleware';
// import { AuthMiddleware } from './auth/auth.middleware';
// import { PrismaService } from 'src/prisma.service';
// import { Users } from './users';
// import { DatabaseModule } from 'src/database/database.module';
// import { usersProviders } from './users.providers';

// @Module({
//   controllers: [UsersController],
//   providers: [UsersService, PrismaService],
// })
// export class UsersModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(LoggerMiddleware)
//       .forRoutes(
//         { path: '/users', method: RequestMethod.GET },
//         {
//           path: '/users',
//           method: RequestMethod.POST,
//         },
//       )
//       .apply(AuthMiddleware)
//       .forRoutes('users');
//   }
// }
