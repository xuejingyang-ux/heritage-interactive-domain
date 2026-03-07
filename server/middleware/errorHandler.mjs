export function notFoundHandler(req, _res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

export function errorHandler(err, req, res, _next) {
  const statusCode = Number.isInteger(err?.statusCode) ? err.statusCode : 500;
  const message = statusCode >= 500 ? 'Internal server error' : err.message;

  if (statusCode >= 500) {
    console.error(`[${req.requestId || 'n/a'}]`, err);
  }

  res.status(statusCode).json({
    error: message,
    requestId: req.requestId || null,
  });
}
