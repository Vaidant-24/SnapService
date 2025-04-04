import { IsEmail, IsNotEmpty, IsIn } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsIn(['customer', 'service_provider'], { message: 'Role must be either customer or service_provider' })
  role?: string = 'customer';
}
