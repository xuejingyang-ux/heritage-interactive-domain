import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Loader2, Image as ImageIcon, History } from 'lucide-react';
import { apiUrl } from '../lib/api';

type PoetryResult = {
  id?: number;
  image: string;
  text: string;
  prompt?: string;
  createdAt?: string;
};

type HistoryResponse = {
  items: {
    id: number;
    prompt: string;
    text: string;
    image: string;
    createdAt: string;
  }[];
};

const SUGGESTED_PROMPTS = ['月照松窗，泉鸣石涧', '雾起江南，舟行灯市', '边城落雪，孤雁归营', '山寺晚钟，竹影微凉', '春潮带雨，柳岸闻笛'];

export default function PoetryModule() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<PoetryResult | null>(null);
  const [history, setHistory] = useState<PoetryResult[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const loadHistory = async () => {
    setHistoryLoading(true);
    try {
      const response = await fetch(apiUrl('/api/poetry/history?limit=8'));
      if (!response.ok) throw new Error('历史记录加载失败');
      const data = (await response.json()) as HistoryResponse;
      setHistory(
        data.items.map((item) => ({
          id: item.id,
          image: item.image,
          text: item.text,
          prompt: item.prompt,
          createdAt: item.createdAt,
        })),
      );
    } catch (err) {
      console.error('Poetry history error:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const generateArt = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError('');

    try {
      const response = await fetch(apiUrl('/api/poetry'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || '生成失败，请稍后重试');
      }

      const latest: PoetryResult = {
        id: data.id,
        image: data.image,
        text: data.text,
        prompt,
        createdAt: new Date().toISOString(),
      };
      setResult(latest);
      setHistory((prev) => [latest, ...prev].slice(0, 8));
    } catch (err) {
      const message = err instanceof Error ? err.message : '生成失败，请稍后重试';
      setError(message);
      console.error('Poetry API error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col lg:flex-row gap-6 p-6 bg-gradient-to-br from-paper via-[#f2e9db] to-[#ebdec9] rounded-3xl border border-ink/10 overflow-hidden">
      <div className="flex-1 flex flex-col justify-center max-w-md">
        <p className="text-[10px] uppercase tracking-[0.24em] text-ochre/80">AI Poetry Painting</p>
        <h3 className="text-3xl font-serif module-title mb-4 mt-1">赋诗·造物</h3>
        <p className="text-ink/65 mb-6 leading-relaxed">输入一句诗词、意象或心境，系统将生成意境解读与国风画面，并自动写入历史卷宗。</p>

        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="如：空山新雨后，天气晚来秋"
            className="w-full h-36 p-4 bg-white/65 border border-ink/15 rounded-2xl focus:ring-2 focus:ring-zhusha/20 focus:border-zhusha outline-none transition-all resize-none font-serif text-lg"
          />
          <button
            onClick={generateArt}
            disabled={loading || !prompt}
            className="absolute bottom-4 right-4 p-3 bg-ink text-paper rounded-xl hover:bg-dailan disabled:opacity-50 transition-all"
            title="生成画境"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>

        {error && <p className="mt-3 text-sm text-zhusha">{error}</p>}

        <div className="mt-5 flex flex-wrap gap-2">
          {SUGGESTED_PROMPTS.map((mood) => (
            <button
              key={mood}
              onClick={() => setPrompt(mood)}
              className="px-3 py-1 text-xs border border-ink/15 rounded-full bg-white/55 hover:bg-ink hover:text-paper transition-colors"
            >
              {mood}
            </button>
          ))}
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-2 text-xs text-ink/60">
            <span className="inline-flex items-center gap-1"><History className="w-3.5 h-3.5" /> 最近生成</span>
            <button onClick={loadHistory} className="hover:text-ink">刷新</button>
          </div>
          <div className="space-y-2 max-h-52 overflow-auto pr-1">
            {historyLoading && <p className="text-xs text-ink/50">加载中...</p>}
            {!historyLoading && history.length === 0 && <p className="text-xs text-ink/50">暂无历史记录</p>}
            {history.map((item) => (
              <button
                key={item.id || `${item.prompt}-${item.createdAt}`}
                onClick={() => setResult(item)}
                className="w-full text-left p-2 rounded-lg border border-ink/10 bg-white/45 hover:border-zhusha/40 hover:bg-white/70 transition-colors"
              >
                <p className="text-xs text-ink/70 line-clamp-1">{item.prompt || '未命名提示词'}</p>
                <p className="text-xs text-ink/45 line-clamp-1">{item.text}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-[1.5] relative min-h-[380px] rounded-2xl overflow-hidden bg-white/35 border border-ink/10 group">
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div
              key={result.id || result.image}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <img src={result.image} alt="AI Generated Art" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-black/15 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 text-paper">
                {result.prompt && <p className="text-xs uppercase tracking-widest mb-2 opacity-75">{result.prompt}</p>}
                <p className="font-serif text-lg leading-relaxed italic opacity-90">{result.text}</p>
              </div>
            </motion.div>
          ) : (
            <motion.div key="placeholder" className="absolute inset-0 flex flex-col items-center justify-center text-ink/20">
              <ImageIcon className="w-16 h-16 mb-4 opacity-10" />
              <p className="font-serif">待君提笔，墨境自来</p>
            </motion.div>
          )}
        </AnimatePresence>

        {loading && (
          <div className="absolute inset-0 bg-paper/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-zhusha border-t-transparent rounded-full animate-spin mb-4" />
            <p className="font-serif text-zhusha animate-pulse">墨色氤氲中...</p>
          </div>
        )}
      </div>
    </div>
  );
}
