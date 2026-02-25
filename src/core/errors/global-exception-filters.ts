import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  NotFoundException,
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
    let message: String | object =
      'Something went wrong. It is our fault not yours.';

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
    } else if (exception instanceof NotFoundException) {
      status = HttpStatus.CONFLICT;
      message = exception.message;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse() as {
        message: string | string[];
      };
      message = response.message;
    }
    // console.log(exception);
    res.status(status).json({ statusCode: status, message });
  }
}
