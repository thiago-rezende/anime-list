import { Router, Request, Response } from 'express'

import v1 from '@routes/v1'
import auth from '@routes/auth'

const router = Router()

router.use('/v1', v1)
router.use('/auth', auth)

router.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'Anime List',
    version: '0.3.0',
    resources: [
      '/auth',
      '/v1'
    ]
  })
})

export default router
