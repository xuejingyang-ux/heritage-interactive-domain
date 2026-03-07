import crypto from 'node:crypto';

export function requestLogger(req, res, next) {
  const startedAt = Date.now();
  const requestId = crypto.randomUUID();
  req.requestId = requestId;

  res.setHeader('x-request-id', requestId);

  res.on('finish', () => {
    const durationMs = Date.now() - startedAt;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs}ms id=${requestId}`,
    );
  });

  next();
}
