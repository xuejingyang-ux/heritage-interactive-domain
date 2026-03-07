import { Router } from 'express';
import { getDatabaseInfo } from '../db.mjs';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    ok: true,
    service: 'backend',
    time: new Date().toISOString(),
    db: getDatabaseInfo(),
  });
});

export default router;
