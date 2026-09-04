import { NextFunction, Request, Response } from 'express'

export interface ApiError extends Error {
  status?: number
}

export function notFoundHandler(req: Request, res: Response, _next: NextFunction) {
  res.status(404).json({ success: false, message: `ROUTE_NOT_FOUND: ${req.originalUrl}` })
}

export function errorHandler(
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const status = err.status || 500
  const message = status === 500 ? 'INTERNAL_SERVER_ERROR' : err.message
  if (status === 500) console.error('[SERVER ERROR]', err)
  res.status(status).json({ success: false, message })
}