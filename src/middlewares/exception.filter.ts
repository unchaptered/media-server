import { Request, Response } from 'express';
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    
    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        message: exception.message,
        messageDetail: exception.getResponse(),
        path: request.url,
      });
  }
}
