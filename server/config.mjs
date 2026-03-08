export const config = {
  apiPort: Number(process.env.PORT || process.env.API_PORT || 8787),
  zhipuApiKey: process.env.ZHIPU_API_KEY || '',
  dbPath: process.env.DB_PATH || 'server/data/app.db',
  corsOrigin: process.env.CORS_ORIGIN || '*',
};

export function requireZhipuApiKey() {
  if (!config.zhipuApiKey) {
    const error = new Error('ZHIPU_API_KEY is not configured on the server');
    error.statusCode = 500;
    throw error;
  }
  return config.zhipuApiKey;
}
