import { Router } from 'express';

import usersRouter from './users.mjs';
import productRouter from './products.mjs';

const router = Router();

router.use( usersRouter );
router.use( productRouter );

export default router;