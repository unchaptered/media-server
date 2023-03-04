import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

// Config
import configuration from './config/configuration';
import { LoggerMiddleware } from './middlewares/log.middleware';
import { PasswordHeaderMiddleware } from './middlewares/api.key.header.middleware';

// Module
import { VideoModule } from './video/video.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      encoding: 'utf8',
      load: [configuration]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('AWS_RDS_HOST'),
        port: configService.get<number>('AWS_RDS_PORT'),
        username: configService.get<string>('AWS_RDS_USERNAME'),
        password: configService.get<string>('AWS_RDS_PASSWORD'),
        database: configService.get<string>('AWS_RDS_DATABASE'),
        entities: [],
        synchronize: configService.get<boolean>('AWS_RDS_SYNCHRONIZE'),
        poolSize: configService.get<number>('AWS_RDS_POOL_SIZE'),
        retryDelay: configService.get<number>('AWS_RDS_RETRY_DELY'),
        retryAttempts: configService.get<number>('AWS_RDS_RETRY_ATTEMPTS'),
        connectTimeout: configService.get<number>('AWS_RDS_CONNECTION_TIMEOUT'),
        autoLoadEntities: true,
        namingStrategy: new SnakeNamingStrategy()
      }),
      inject: [ConfigService]
    }),
    VideoModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    
    consumer.apply(PasswordHeaderMiddleware).forRoutes('*');
    consumer.apply(LoggerMiddleware).forRoutes('*');

  }

}
