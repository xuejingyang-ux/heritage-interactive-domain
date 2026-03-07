import { Router } from 'express';
import { listPoetryGenerations, savePoetryGeneration } from '../db.mjs';
import { generatePoetryArt } from '../services/poetryService.mjs';
import { asyncHandler, createHttpError } from '../utils/http.mjs';

const router = Router();

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const prompt = typeof req.body?.prompt === 'string' ? req.body.prompt.trim() : '';
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

    res.json({
      id,
      text: result.interpretation,
      image: result.image,
    });
  }),
);

router.get(
  '/history',
  asyncHandler(async (req, res) => {
    const limit = Number(req.query.limit || 20);
    const rows = listPoetryGenerations(limit).map((row) => ({
      id: row.id,
      prompt: row.prompt,
      text: row.interpretation,
      image: row.image_url,
      modelText: row.model_text,
      modelImage: row.model_image,
      createdAt: row.created_at,
    }));

    res.json({
      items: rows,
      count: rows.length,
    });
  }),
);

export default router;
