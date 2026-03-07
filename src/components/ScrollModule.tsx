import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, BookOpenText } from 'lucide-react';

type ScrollItem = {
  era: string;
  title: string;
  desc: string;
  focus: string;
  knowledge: string[];
  img: string;
};

const SCROLL_ITEMS: ScrollItem[] = [
  {
    era: '汉代',
    title: '丝路初启',
    desc: '张骞通西域后，工艺、乐舞与图像样式沿商路流动，形成早期跨域文化交换。',
    focus: '交流关键词：商队、乐舞、织造',
    knowledge: ['丝绸与金属器纹样在跨域传播中互相借鉴。', '乐舞图像成为多民族交流的重要视觉证据。', '工艺流动推动了审美和材料技术并行发展。'],
    img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Zhang_Qian.jpg',
  },
  {
    era: '唐代',
    title: '盛世百工',
    desc: '城市手工业分工成熟，金银器、织锦和木作并进，审美与技术走向高峰。',
    focus: '工艺关键词：金银错、缂丝、营造法式',
    knowledge: ['作坊体系推动规模化生产与精细分工。', '织锦和金银器常以同源纹样表达礼制秩序。', '都城消费文化持续刺激手工艺创新。'],
    img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Court_ladies_pounding_silk_from_a_painting_%28%E6%8D%A3%E7%BB%83%E5%9B%BE%29_by_Emperor_Huizong.jpg',
  },
  {
    era: '宋元',
    title: '市井与雅艺',
    desc: '民间表演与文人美学并行，戏曲、皮影、书画和器物设计相互借鉴。',
    focus: '传播关键词：瓦舍、勾栏、画院',
    knowledge: ['市民文化兴起，公共表演空间迅速扩展。', '皮影与戏曲在叙事结构上形成互文。', '文人审美进入日常器物和生活场景。'],
    img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Chinese_shadow_puppetry.jpg',
  },
  {
    era: '明清',
    title: '匠作成谱',
    desc: '木作、园林与宫殿营造形成成体系技法，工艺手册与师徒传承并行发展。',
    focus: '体系关键词：榫卯谱、造园、官式营造',
    knowledge: ['工艺谱录把经验转化为可复用的技术语言。', '官式与民间营造相互影响，形成多层标准。', '师徒制度保障复杂工艺的稳定传承。'],
    img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Classical_Gardens_of_Suzhou-111935.jpg',
  },
  {
    era: '当代',
    title: '数字新生',
    desc: '三维扫描、动作捕捉和生成式内容进入非遗传播场景，实现沉浸式再演绎。',
    focus: '融合关键词：Web3D、AIGC、交互叙事',
    knowledge: ['数字资产让工艺细节可长期保存与复原。', '交互叙事让观众从旁观者变为参与者。', 'AIGC 提升内容生产效率，扩大非遗传播覆盖。'],
    img: 'https://commons.wikimedia.org/wiki/Special:FilePath/3D_scanning_of_a_historic_temple_chariot_at_the_National_Crafts_Museum%2C_Delhi.png',
  },
];

export default function ScrollModule() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showKnowledge, setShowKnowledge] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const item = SCROLL_ITEMS[activeIndex];
  const currentImageReady = !!loadedImages[item.img];

  useEffect(() => {
    setShowKnowledge(false);
  }, [activeIndex]);

  useEffect(() => {
    let cancelled = false;

    SCROLL_ITEMS.forEach(({ img }) => {
      if (loadedImages[img]) return;
      const preload = new Image();
      preload.decoding = 'async';
      preload.referrerPolicy = 'no-referrer';
      preload.onload = () => {
        if (cancelled) return;
        setLoadedImages((prev) => (prev[img] ? prev : { ...prev, [img]: true }));
      };
      preload.onerror = () => {
        if (cancelled) return;
        setLoadedImages((prev) => (prev[img] ? prev : { ...prev, [img]: true }));
      };
      preload.src = img;
    });

    return () => {
      cancelled = true;
    };
  }, [loadedImages]);

  return (
    <section className="h-full rounded-[28px] overflow-hidden text-paper border border-[#f2dec0]/20 bg-gradient-to-br from-[#2d1f19] via-[#2a1b16] to-[#1b1410]">
      <div className="relative h-full p-5 md:p-8 lg:p-10">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/old-map.png')]" />
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-paper/55">Chronicle Timeline</p>
              <p className="font-serif text-sm text-paper/85 mt-1">第 {activeIndex + 1} / {SCROLL_ITEMS.length} 幕</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
                disabled={activeIndex === 0}
                className="p-2 rounded-full border border-white/25 disabled:opacity-30 hover:bg-white/5"
                aria-label="prev"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveIndex((i) => Math.min(SCROLL_ITEMS.length - 1, i + 1))}
                disabled={activeIndex === SCROLL_ITEMS.length - 1}
                className="p-2 rounded-full border border-white/25 disabled:opacity-30 hover:bg-white/5"
                aria-label="next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-5">
            {SCROLL_ITEMS.map((eraItem, idx) => (
              <button
                key={eraItem.title}
                onClick={() => setActiveIndex(idx)}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${activeIndex === idx ? 'border-zhusha bg-zhusha text-white' : 'border-white/25 text-paper/75 hover:text-paper'}`}
              >
                {eraItem.era}
              </button>
            ))}
          </div>

          <div className="flex-1 min-h-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: 26 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -26 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="h-full flex flex-col lg:flex-row gap-6 md:gap-10 items-center"
              >
                <motion.div
                  className={`w-full min-w-0 ${showKnowledge ? 'lg:max-w-none' : 'lg:max-w-3xl lg:mx-auto'}`}
                  animate={{ flex: showKnowledge ? 1.2 : 1 }}
                  transition={{ duration: 0.34, ease: 'easeOut' }}
                >
                  <motion.button
                    type="button"
                    onClick={() => setShowKnowledge((v) => !v)}
                    whileTap={{ scale: 0.985 }}
                    animate={{ scale: showKnowledge ? 1.06 : 0.94 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className={`relative group w-full aspect-[4/3] text-left rounded-2xl overflow-hidden shadow-2xl ${showKnowledge ? 'max-h-[450px]' : 'max-h-[340px]'}`}
                  >
                    <img
                      src={item.img}
                      alt={item.title}
                      loading="eager"
                      decoding="async"
                      className={`w-full h-full object-cover object-center transition-opacity duration-300 ${currentImageReady ? 'opacity-100' : 'opacity-0'}`}
                      referrerPolicy="no-referrer"
                      onLoad={() => setLoadedImages((prev) => (prev[item.img] ? prev : { ...prev, [item.img]: true }))}
                      onError={() => setLoadedImages((prev) => (prev[item.img] ? prev : { ...prev, [item.img]: true }))}
                    />
                    {!currentImageReady && (
                      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.07),rgba(255,255,255,0.12),rgba(255,255,255,0.07))] animate-pulse" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
                    <div className="absolute top-4 left-4 z-20 bg-zhusha text-white px-4 py-1 text-sm font-serif rounded-full">{item.era}</div>
                    <div className="absolute bottom-4 left-4 right-4 z-20">
                      <h3 className="font-serif text-2xl md:text-3xl leading-tight">{item.title}</h3>
                      <p className="text-xs text-paper/75 mt-2">{item.focus}</p>
                    </div>
                    <div className="absolute bottom-3 right-3 z-20 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
                      {showKnowledge ? '再点收拢札记' : '点击展开札记'}
                    </div>
                  </motion.button>
                </motion.div>

                <motion.aside
                  className="w-full min-w-0 overflow-hidden"
                  initial={false}
                  animate={{
                    flex: showKnowledge ? 0.8 : 0,
                    opacity: showKnowledge ? 1 : 0,
                    x: showKnowledge ? 0 : 16,
                    maxHeight: showKnowledge ? 620 : 0,
                  }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  style={{ pointerEvents: showKnowledge ? 'auto' : 'none' }}
                >
                  <div className="rounded-2xl border border-white/15 bg-white/[0.06] backdrop-blur-sm p-5 md:p-6">
                    <h2 className="text-3xl md:text-4xl font-serif mb-4 leading-tight">{item.title}</h2>
                    <p className="text-sm md:text-base text-paper/80 font-serif leading-7">{item.desc}</p>
                    <div className="mt-5 p-4 rounded-xl border border-[#f2dec0]/20 bg-black/20">
                      <p className="text-xs uppercase tracking-[0.2em] text-tenghuang inline-flex items-center gap-2 mb-3">
                        <BookOpenText className="w-3.5 h-3.5" />
                        相关知识
                      </p>
                      <ul className="space-y-2 text-sm text-paper/85 leading-relaxed">
                        {item.knowledge.map((point) => (
                          <li key={point}>- {point}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-7 flex items-center gap-4">
                      <div className="w-12 h-[1px] bg-tenghuang/80" />
                      <span className="text-xs tracking-[0.3em] uppercase text-tenghuang">Section {String(activeIndex + 1).padStart(2, '0')}</span>
                    </div>
                  </div>
                </motion.aside>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
