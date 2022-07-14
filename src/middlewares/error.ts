import { Request, Response, NextFunction } from 'express'

import { JsonWebTokenError, NotBeforeError, TokenExpiredError } from 'jsonwebtoken'

import { AuthenticationError, AuthorizationError } from '~/errors/auth'

import { CreationError, InvalidRequestBodyError, NotFoundError, UpdateError } from '~/errors/common'

const errorMiddleware = function (err: Error, _req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) return next(err)

  console.log('[anime-list] <error> ' + err)

  if (err && err instanceof JsonWebTokenError) {
    return res.status(401).json({
      error: {
        message: err.message,
        name: err.name,
        expiredAt: (err instanceof TokenExpiredError) ? err.expiredAt : undefined,
        date: (err instanceof NotBeforeError) ? err.date : undefined
      }
    })
  }

  if (err && err instanceof AuthenticationError) {
    return res.status(401).json({
      error: {
        message: err.message,
        name: err.name
      }
    })
  }

  if (err && err instanceof AuthorizationError) {
    return res.status(403).json({
      error: {
        message: err.message,
        name: err.name
      }
    })
  }

  if (err && err instanceof InvalidRequestBodyError) {
    return res.status(400).json({
      error: {
        message: err.message,
        fields: (err as InvalidRequestBodyError).fields,
        name: err.name
      }
    })
  }

  if (err && err instanceof CreationError) {
    return res.status(409).json({
      error: {
        message: err.message,
        fields: (err as CreationError).fields.length ? err.fields : undefined,
        name: err.name
      }
    })
  }

  if (err && err instanceof UpdateError) {
    return res.status(409).json({
      error: {
        message: err.message,
        fields: (err as UpdateError).fields,
        name: err.name
      }
    })
  }

  if (err && err instanceof NotFoundError) {
    return res.status(404).json({
      error: {
        message: err.message,
        name: err.name
      }
    })
  }

  res.status(500).json({
    error: {
      message: err.message,
      name: err.name
    }
  })
}

export default errorMiddleware
