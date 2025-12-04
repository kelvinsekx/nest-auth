import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  create(body) {
    return body;
  }
}
