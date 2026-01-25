import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import {
  EmailAlreadyExistsError,
  EmailDoNotExistOnReset,
  EmailDoNotExistOnVerify,
  ResetTokenWasUsed,
  TokensMismatchError,
} from './../errors/auth-exceptions';

import { Response } from 'express';

@Catch(Error)
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: String | Object = 'Something went wrong.';

    if (exception instanceof EmailAlreadyExistsError) {
      status = HttpStatus.CONFLICT;
      message = exception.message;
    } else if (exception instanceof EmailDoNotExistOnVerify) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
    } else if (exception instanceof EmailDoNotExistOnReset) {
      status = HttpStatus.UNAUTHORIZED;
      message = exception.message;
    } else if (exception instanceof ResetTokenWasUsed) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
    } else if (exception instanceof TokensMismatchError) {
      status = HttpStatus.CONFLICT;
      message = exception.message;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse();
    }

    res.status(status).json({ statusCode: status, message });
  }
}
