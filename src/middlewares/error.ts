import { InvalidAuthRequestBodyError } from '@errors/auth'
import { InvalidCreateUserRequestBodyError, UserCreationError } from '@errors/user'
import { Request, Response, NextFunction } from 'express'

import { TokenExpiredError } from 'jsonwebtoken'

const errorMiddleware = function (err: Error, _req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) return next(err)

  console.log('[anime-list] <error> ' + err)

  if (err && err.name === 'JsonWebTokeError') {
    return res.status(401).json({
      error: {
        message: err.message,
        name: err.name
      }
    })
  }

  if (err && err.name === 'AuthorizationError') {
    return res.status(401).json({
      error: {
        message: err.message,
        name: err.name
      }
    })
  }

  if (err && err.name === 'InvalidAuthRequestBodyError') {
    return res.status(400).json({
      error: {
        message: err.message,
        fields: (err as InvalidAuthRequestBodyError).fields,
        name: err.name
      }
    })
  }

  if (err && err.name === 'InvalidCreateUserRequestBodyError') {
    return res.status(400).json({
      error: {
        message: err.message,
        fields: (err as InvalidCreateUserRequestBodyError).fields,
        name: err.name
      }
    })
  }

  if (err && err.name === 'UserCreationError') {
    return res.status(409).json({
      error: {
        message: err.message,
        fields: (err as UserCreationError).fields,
        name: err.name
      }
    })
  }

  if (err && err.name === 'InvalidCredentialsError') {
    return res.status(401).json({
      error: {
        message: err.message,
        name: err.name
      }
    })
  }

  if (err && err.name === 'UserNotFoundError') {
    return res.status(404).json({
      error: {
        message: err.message,
        name: err.name
      }
    })
  }

  if (err && err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: {
        message: err.message,
        name: err.name,
        expiredAt: (err as TokenExpiredError).expiredAt
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
