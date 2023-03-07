import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';


// Config
import { LoggerMiddleware } from '@middlewares/log.middleware';

// Module
import { VideoModule } from '@video/video.module';
import { TaskModule } from '@task/task.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      encoding: 'utf8',
      load: []
    }),
    ScheduleModule.forRoot(),
    TaskModule,
    VideoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    
    consumer.apply(LoggerMiddleware).forRoutes('*');

  }

}
