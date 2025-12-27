import { ConfigService } from '@nestjs/config';

const configSer = new ConfigService();
export const jwtConstants = {
  secret: configSer.get<string>('JWT_SECRET'),
};
