import { NextFunction, Request, Response, RequestHandler } from 'express'
import { ApiError } from '../middleware/errorHandler.js'

export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => {
      const e: ApiError = err instanceof Error ? err : new Error(String(err))
      if (!e.status) e.status = 500
      next(e)
    })
  }
}

export class HttpError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}