import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { GeoLocationDto } from 'src/user/dto-user/service-provider-dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: 'your_jwt_secret_key', // Use environment variables in production
    });
  }

  async validate(payload: {
    sub: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    location: GeoLocationDto;
  }) {
    const isValid = await this.authService.verifyToken(payload.sub);

    if (!isValid) {
      throw new UnauthorizedException();
    }

    return {
      userId: payload.sub,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      role: payload.role,
      location: payload.location,
    };
  }
}
