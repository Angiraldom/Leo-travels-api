import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { IErrorResponse } from 'src/shared/utils/interface/IErrorResponse.interface';
import { BuildReponseError } from 'src/shared/utils/utilities/Response.util';

@Catch()
export class HttpExceptionFilter<T> implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const objectError: IErrorResponse = BuildReponseError(exception, request);

    response.status(objectError.statusCode).json(objectError);
  }
}
