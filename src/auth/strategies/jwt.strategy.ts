import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const secret = configService.get<string>('jwt.secret') || process.env.JWT_SECRET || '5YrmFRKZSFLiWc23dh4LNHLkvHALQYchjTjP82jpDybhm';
    
    console.log('🔑 JWT Strategy initialized');
    console.log('🔑 JWT Secret from config:', configService.get<string>('jwt.secret') ? 'Found' : 'Not found');
    console.log('🔑 JWT Secret from env:', process.env.JWT_SECRET ? 'Found' : 'Not found');
    console.log('🔑 Using secret:', secret ? secret.substring(0, 10) + '...' : 'UNDEFINED!');
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    console.log('✅ JWT validate called with payload:', { sub: payload.sub, email: payload.email });
    return { 
      id: payload.sub, 
      email: payload.email,
      role: payload.role || 'user',
      name: payload.name,
      picture: payload.picture
    };
  }
}
