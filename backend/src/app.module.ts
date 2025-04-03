import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const mongoDbUri = configService.get<string>('MONGODB_URI');
        return {
          uri: mongoDbUri,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
