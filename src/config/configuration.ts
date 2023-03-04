import { readFileSync } from 'fs';
import { join } from 'path';

export default (() => ({
    JWT_PRIVATE_KEY: readFileSync(join(process.cwd(), 'private.pem'), { encoding: 'utf8' }),
    JWT_PUBLIC_KEY: readFileSync(join(process.cwd(), 'public.pem'), { encoding: 'utf8' })
}));