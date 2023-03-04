import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const userAgent = req.get('user-agent') || '';

    res.on('finish', () => {
      console.log(`[Nest] ${process.pid}  - ${req.method} ${req.path} ${res.statusCode} ${req.headers['x-forwarded-for'] ?? req.ip} ${userAgent}`);
    });

    next();
  }
}
