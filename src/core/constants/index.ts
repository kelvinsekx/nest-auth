import { ConfigService } from '@nestjs/config';

const configSer = new ConfigService();
export const jwtConstants = {
  secret: configSer.get<string>('JWT_SECRET'),
};

export const VALID_RENTAL_STATUS = [
  'PENDING',
  'ACTIVE',
  'RETURNED',
  'EXPIRED',
] as const;
