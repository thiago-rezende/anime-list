import { Request, Response, NextFunction } from 'express'

const errorMiddleware = function (err: Error, _req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) return next(err)

  console.log('[anime-list] <error> ' + err)

  res.status(500).json({
    error: {
      message: err.message,
      name: err.name
    }
  })
}

export default errorMiddleware
