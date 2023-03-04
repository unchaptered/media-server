import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class PasswordHeaderMiddleware implements NestMiddleware {

  use(req: any, res: any, next: () => void) {

    req.headers['server-key'] = 'a2N3Q6n4s6Z9a0';
    
    next();

  }
}
