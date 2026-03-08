import { generatePoetryArt } from '../../server/services/poetryService.mjs';

const historyStore = globalThis.__poetryHistoryStore || [];

if (!globalThis.__poetryHistoryStore) {
  globalThis.__poetryHistoryStore = historyStore;
}

function json(data, init = {}) {
  const headers = new Headers(init.headers || {});
  headers.set('Content-Type', 'application/json; charset=utf-8');

  return new Response(JSON.stringify(data), {
    ...init,
    headers,
  });
}

function createHttpError(status, message) {
  const error = new Error(message);
  error.statusCode = status;
  return error;
}

function getRequestPath(url) {
  const pathname = new URL(url).pathname;
  return pathname.replace(/\/+$/, '') || '/';
}

function listPoetryGenerations(limit = 20) {
  const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(Math.floor(limit), 1), 100) : 20;
  return historyStore.slice(0, safeLimit);
}

function savePoetryGeneration(record) {
  const entry = {
    id: Date.now(),
    prompt: record.prompt,
    interpretation: record.interpretation,
    image_url: record.imageUrl,
    model_text: record.modelText,
    model_image: record.modelImage,
    created_at: new Date().toISOString(),
  };

  historyStore.unshift(entry);
  if (historyStore.length > 100) {
    historyStore.length = 100;
  }

  return entry.id;
}

export const config = {
  path: '/api/*',
};

export default async function handler(req) {
  try {
    const url = new URL(req.url);
    const path = getRequestPath(req.url);

    if (req.method === 'GET' && path === '/api/health') {
      return json({
        ok: true,
        service: 'netlify-function',
        time: new Date().toISOString(),
        storage: 'in-memory',
      });
    }

    if (req.method === 'GET' && path === '/api/poetry/history') {
      const limit = Number(url.searchParams.get('limit') || 20);
      const items = listPoetryGenerations(limit).map((row) => ({
        id: row.id,
        prompt: row.prompt,
        text: row.interpretation,
        image: row.image_url,
        modelText: row.model_text,
        modelImage: row.model_image,
        createdAt: row.created_at,
      }));

      return json({
        items,
        count: items.length,
      });
    }

    if (req.method === 'POST' && path === '/api/poetry') {
      const body = await req.json().catch(() => null);
      const prompt = typeof body?.prompt === 'string' ? body.prompt.trim() : '';

      if (!prompt) {
        throw createHttpError(400, 'prompt is required');
      }

      const result = await generatePoetryArt(prompt);
      const id = savePoetryGeneration({
        prompt,
        interpretation: result.interpretation,
        imageUrl: result.image,
        modelText: result.modelText,
        modelImage: result.modelImage,
      });

      return json({
        id,
        text: result.interpretation,
        image: result.image,
      });
    }

    throw createHttpError(404, `Route not found: ${req.method} ${path}`);
  } catch (error) {
    const statusCode = Number.isInteger(error?.statusCode) ? error.statusCode : 500;
    const message = statusCode >= 500 ? 'Internal server error' : error.message;

    if (statusCode >= 500) {
      console.error('[netlify-api]', error);
    }

    return json(
      {
        error: message,
      },
      { status: statusCode },
    );
  }
}
