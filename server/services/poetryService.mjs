import { requireZhipuApiKey } from '../config.mjs';

const ZHIPU_API_BASE = 'https://open.bigmodel.cn/api/paas/v4';
const MODEL_TEXT = 'glm-4-flash';
const MODEL_IMAGE = 'cogview-3-flash';

async function zhipuFetch(path, body, apiKey) {
  const res = await fetch(`${ZHIPU_API_BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`智谱AI ${path} error ${res.status}: ${text}`);
  }
  return res.json();
}

export async function generatePoetryArt(prompt) {
  const apiKey = requireZhipuApiKey();

  // Step 1: 文本意境解读
  const textData = await zhipuFetch('/chat/completions', {
    model: MODEL_TEXT,
    messages: [
      {
        role: 'user',
        content:
          `你是中国古典诗词与水墨画领域专家。针对以下诗词或意境："${prompt}"，` +
          `请返回 JSON，包含两个字段：interpretation（不超过100字的中文意境解读）` +
          `和 image_prompt（用于生成传统水墨画的英文提示词）。`,
      },
    ],
    response_format: { type: 'json_object' },
  }, apiKey);

  let interpretation = '意境未成，且待再试。';
  let imagePrompt = 'misty mountains, river, traditional Chinese ink wash painting';
  try {
    const parsed = JSON.parse(textData.choices?.[0]?.message?.content || '{}');
    if (typeof parsed.interpretation === 'string') interpretation = parsed.interpretation;
    if (typeof parsed.image_prompt === 'string') imagePrompt = parsed.image_prompt;
  } catch {
    // 解析失败时使用默认值
  }

  // Step 2: 图像生成（失败时降级为占位图）
  let image = 'https://picsum.photos/seed/ink/1200/675';
  try {
    const imageData = await zhipuFetch('/images/generations', {
      model: MODEL_IMAGE,
      prompt:
        `A high quality traditional Chinese ink wash painting, ${imagePrompt}, ` +
        `ethereal atmosphere, textured rice paper, masterpiece, elegant brushwork.`,
      size: '1344x768',
    }, apiKey);
    const url = imageData.data?.[0]?.url;
    if (url) image = url;
  } catch (err) {
    console.error('[CogView] 图像生成失败，使用占位图:', err.message);
  }

  return {
    interpretation,
    image,
    modelText: MODEL_TEXT,
    modelImage: MODEL_IMAGE,
  };
}
