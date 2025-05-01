import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryProvider } from './cloudinary.provider';

@Module({
  imports: [ConfigModule], // needed to access env vars
  providers: [CloudinaryProvider],
  exports: [CloudinaryProvider], // so it can be used in other modules
})
export class CloudinaryModule {}
