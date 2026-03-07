import React, { useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu,
  X,
  Github,
  Globe,
  ArrowRight,
  Volume2,
  VolumeX,
  Landmark,
  Drama,
  ScrollText,
  Sparkles,
  Compass,
  Scroll,
} from 'lucide-react';
import SunmaoModule from './components/SunmaoModule';
import ShadowPuppetModule from './components/ShadowPuppetModule';
import PoetryModule from './components/PoetryModule';
import ScrollModule from './components/ScrollModule';
import { cn } from './lib/utils';

type PageId = 'home' | 'sunmao' | 'puppet' | 'poetry' | 'scroll';

const PAGE_PATHS: Record<PageId, string> = {
  home: '/',
  sunmao: '/sunmao',
  puppet: '/puppet',
  poetry: '/poetry',
  scroll: '/scroll',
};

const NAV_ITEMS: { id: PageId; title: string; subtitle: string }[] = [
  { id: 'home', title: '境生', subtitle: 'Portal' },
  { id: 'sunmao', title: '解构', subtitle: 'Craft' },
  { id: 'puppet', title: '入戏', subtitle: 'Shadow' },
  { id: 'poetry', title: '赋诗', subtitle: 'AIGC' },
  { id: 'scroll', title: '长卷', subtitle: 'Chronicle' },
];

const PAGE_META: Record<Exclude<PageId, 'home'>, { no: string; title: string; desc: string; note: string; keyword: string }> = {
  sunmao: {
    no: '壹',
    title: '解构·匠心',
    desc: '通过 Web3D 分步拆解榫卯结构，观察构件锁合、受力逻辑与工艺秩序。',
    note: '榫卯以“以形制力、以巧合稳”为旨归，不依一钉，仍可久固。',
    keyword: '木作营造',
  },
  puppet: {
    no: '贰',
    title: '入戏·非遗',
    desc: '使用摄像头动作追踪驱动数字皮影，实时映射你的动作节律与舞台气势。',
    note: '皮影集雕刻、着彩、说唱与操偶于一体，是活态民间叙事艺术。',
    keyword: '光影叙事',
  },
  poetry: {
    no: '叁',
    title: '赋诗·造物',
    desc: '输入诗词、意象或心境，自动生成意境解读与国风画境，并留存生成史。',
    note: '诗画同源，贵在“言有尽而意无穷”，以少字见大境。',
    keyword: '诗画生成',
  },
  scroll: {
    no: '肆',
    title: '长卷·传承',
    desc: '沿朝代切换非遗发展脉络，以图像化叙事浏览工艺传播与文化再生。',
    note: '时间长卷从器物工艺延展至数字重构，见证传承与创新并行。',
    keyword: '文明谱系',
  },
};

const CULTURE_CARDS = [
  {
    title: '器以载道',
    desc: '榫卯重“形制与礼序”，将工程理性与东方审美合于一体。',
    icon: Landmark,
  },
  {
    title: '戏以传情',
    desc: '皮影借一盏灯与一块幕，演尽家国、乡土与人情。',
    icon: Drama,
  },
  {
    title: '诗画同源',
    desc: '以文字召唤图景，让古典意象在数字媒介中重生。',
    icon: Sparkles,
  },
  {
    title: '文脉长卷',
    desc: '跨代对照工艺、传播与审美，观看传统如何更新自身。',
    icon: ScrollText,
  },
];

const IMMERSIVE_POINTS = [
  { title: '多模态体验', text: 'Web3D、动作追踪、AIGC 协同' },
  { title: '活态内容', text: '用户参与即内容生成的一部分' },
  { title: '可持续传播', text: '历史留存与数字再演绎并行' },
];

const PENTATONIC = [196, 220, 246.94, 293.66, 329.63, 392];

function normalizePath(pathname: string) {
  if (!pathname) return '/';
  const path = pathname.trim();
  if (path === '/') return '/';
  return path.endsWith('/') ? path.slice(0, -1) : path;
}

function pageFromPath(pathname: string): PageId {
  const normalized = normalizePath(pathname);
  const pair = Object.entries(PAGE_PATHS).find(([, path]) => path === normalized);
  return (pair?.[0] as PageId) || 'home';
}

function pathFromPage(page: PageId) {
  return PAGE_PATHS[page];
}

function HomePage({ onEnter, onNavigate }: { onEnter: () => void; onNavigate: (id: PageId) => void }) {
  const guideItems = Object.entries(PAGE_META) as [Exclude<PageId, 'home'>, (typeof PAGE_META)[Exclude<PageId, 'home'>]][];

  return (
    <section className="relative min-h-[calc(100vh-82px)] px-6 py-8 md:py-14">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.1] bg-[url('https://www.transparenttextures.com/patterns/rice-paper-3.png')]" />
        <div className="absolute top-[13%] right-[2%] md:right-[6%] vertical-text font-serif text-ink/13 text-4xl md:text-6xl select-none">万象皆可入境</div>
        <div className="absolute bottom-[11%] left-[6%] vertical-text font-serif text-ink/13 text-4xl md:text-6xl select-none">古意今生</div>
        <div className="floating-mist" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="heritage-shell ink-frame p-7 md:p-10"
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <span className="seal-chip mb-5 inline-flex">数字国风展馆</span>
              <h1 className="hero-calligraphy text-[clamp(3rem,10vw,6.6rem)] leading-[0.96] text-ink">境生·万象</h1>
              <p className="max-w-3xl mt-5 text-ink/75 text-[clamp(0.95rem,2.3vw,1.1rem)] font-serif leading-8">
                以数字技术重绘中华非遗的形、声、意、境，让传统从“可观看”走向“可参与”，
                在交互中延续其生命力与当代表达。
              </p>
            </div>

            <div className="heritage-shell p-4 md:p-5 max-w-sm border border-ink/10 bg-paper/75">
              <p className="text-[10px] tracking-[0.28em] uppercase text-ink/55">Preface</p>
              <p className="mt-2 font-serif text-sm leading-7 text-ink/75">
                此域取“器、戏、诗、史”四境为脉，观工艺之理，感叙事之情，见美学之神，览传承之势。
              </p>
              <div className="ornament-divider mt-4" />
              <div className="mt-4 flex items-center gap-2 text-xs text-ink/55">
                <Compass className="w-3.5 h-3.5" />
                建议佩戴耳机开启雅乐体验
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-3">
            {IMMERSIVE_POINTS.map((point) => (
              <div key={point.title} className="rounded-xl border border-ink/10 bg-white/55 px-4 py-3">
                <p className="text-xs tracking-[0.16em] uppercase text-ochre/90">{point.title}</p>
                <p className="mt-1 text-sm text-ink/70">{point.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col md:flex-row items-center gap-4">
            <button
              onClick={onEnter}
              className="px-10 py-3.5 bg-ink text-paper rounded-full font-serif text-lg hover:bg-dailan transition-all inline-flex items-center gap-2"
            >
              开启沉浸体验 <ArrowRight className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 text-ink/55">
              <Scroll className="w-4.5 h-4.5" />
              <span className="text-xs tracking-widest uppercase">Web3D x AIGC x Motion</span>
            </div>
          </div>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {CULTURE_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="heritage-shell p-4 md:p-5 min-h-[168px]">
                <div className="w-9 h-9 rounded-full bg-zhusha/10 text-zhusha flex items-center justify-center mb-3">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-lg module-title mb-2">{card.title}</h3>
                <p className="text-sm text-ink/65 leading-6">{card.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 heritage-shell p-5 md:p-7">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-5">
            <div>
              <p className="text-[10px] tracking-[0.22em] uppercase text-ink/50">Guided Journey</p>
              <h2 className="font-serif text-2xl md:text-3xl module-title mt-1">四境导览</h2>
            </div>
            <p className="text-sm text-ink/60">按推荐路径依次体验：解构 → 入戏 → 赋诗 → 长卷</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {guideItems.map(([id, meta]) => (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                className="group text-left rounded-2xl border border-ink/10 bg-white/55 hover:border-zhusha/35 hover:bg-white/75 transition-all p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-zhusha text-xl font-serif">{meta.no}</p>
                    <h3 className="font-serif text-2xl module-title mt-1">{meta.title}</h3>
                    <p className="text-sm text-ink/65 mt-2 leading-6">{meta.desc}</p>
                  </div>
                  <span className="module-chip">{meta.keyword}</span>
                </div>
                <div className="mt-4 inline-flex items-center gap-1.5 text-xs tracking-[0.14em] uppercase text-ink/50 group-hover:text-zhusha transition-colors">
                  进入模块 <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ModulePage({ page }: { page: Exclude<PageId, 'home'> }) {
  const meta = PAGE_META[page];
  const content = useMemo(() => {
    if (page === 'sunmao') return <SunmaoModule />;
    if (page === 'puppet') return <ShadowPuppetModule />;
    if (page === 'poetry') return <PoetryModule />;
    return <ScrollModule />;
  }, [page]);

  return (
    <section className="max-w-7xl mx-auto px-6 py-9 md:py-12">
      <div className="heritage-shell p-6 md:p-8 mb-8 md:mb-10">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="text-zhusha font-serif text-2xl">{meta.no}</span>
          <span className="module-chip">{meta.keyword}</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-serif module-title">{meta.title}</h2>
        <p className="text-ink/70 mt-3 max-w-3xl leading-7">{meta.desc}</p>
        <div className="ornament-divider mt-4 mb-4" />
        <p className="text-sm text-ochre/95 leading-7">{meta.note}</p>
      </div>
      <div className={cn('w-full ink-frame', page === 'poetry' ? 'min-h-[740px]' : 'aspect-video', page === 'scroll' ? 'min-h-[620px]' : '')}>{content}</div>
    </section>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState<PageId>(() => pageFromPath(window.location.pathname));
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [audioAvailable, setAudioAvailable] = useState(true);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const musicTimerRef = useRef<number | null>(null);

  React.useEffect(() => {
    const onPopState = () => {
      setActivePage(pageFromPath(window.location.pathname));
      setIsMenuOpen(false);
      window.scrollTo({ top: 0, behavior: 'auto' });
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  React.useEffect(() => {
    return () => {
      if (musicTimerRef.current) window.clearInterval(musicTimerRef.current);
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const playGuFengNote = () => {
    const ctx = audioCtxRef.current;
    const master = masterGainRef.current;
    if (!ctx || !master) return;

    const freq = PENTATONIC[Math.floor(Math.random() * PENTATONIC.length)] * (Math.random() > 0.78 ? 2 : 1);
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.996, now + 0.9);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1500, now);
    filter.Q.setValueAtTime(1, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.15, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    osc.start(now);
    osc.stop(now + 1.25);
  };

  const startMusic = async () => {
    if (!('AudioContext' in window || 'webkitAudioContext' in window)) {
      setAudioAvailable(false);
      return;
    }

    if (!audioCtxRef.current) {
      const Context = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Context();
      const master = ctx.createGain();
      master.gain.value = 0.07;
      master.connect(ctx.destination);
      audioCtxRef.current = ctx;
      masterGainRef.current = master;
    }

    const ctx = audioCtxRef.current;
    const master = masterGainRef.current;
    if (!ctx || !master) return;

    await ctx.resume();
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.07, ctx.currentTime + 0.2);

    playGuFengNote();

    if (!musicTimerRef.current) {
      musicTimerRef.current = window.setInterval(() => {
        playGuFengNote();
      }, 1250);
    }
  };

  const stopMusic = () => {
    const ctx = audioCtxRef.current;
    const master = masterGainRef.current;

    if (musicTimerRef.current) {
      window.clearInterval(musicTimerRef.current);
      musicTimerRef.current = null;
    }

    if (!ctx || !master) return;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
  };

  const toggleMusic = async () => {
    if (musicOn) {
      stopMusic();
      setMusicOn(false);
      return;
    }
    await startMusic();
    setMusicOn(true);
  };

  const goPage = (id: PageId) => {
    const path = pathFromPage(id);
    const currentPath = normalizePath(window.location.pathname);

    if (path !== currentPath) {
      window.history.pushState({}, '', path);
    }

    setActivePage(id);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen font-sans bg-paper text-ink selection:bg-zhusha selection:text-white">
      <nav className="sticky top-0 left-0 w-full z-50 nav-shell px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button className="w-11 h-11 bg-ink flex items-center justify-center text-paper font-serif text-xl rounded-sm" onClick={() => goPage('home')}>
            境
          </button>
          <button className="hidden md:block text-left" onClick={() => goPage('home')}>
            <h1 className="text-xl font-serif tracking-tight">境生·万象</h1>
            <p className="text-[10px] uppercase tracking-widest opacity-50">Digital Realm of Intangible Heritage</p>
          </button>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => goPage(item.id)}
              className={cn('group relative py-2 text-sm transition-colors nav-link', activePage === item.id ? 'active' : '')}
            >
              <span className="font-serif text-base block">{item.title}</span>
              <span className="text-[9px] uppercase tracking-[0.14em] block opacity-45 group-hover:opacity-100 transition-opacity">{item.subtitle}</span>
              {activePage === item.id && <motion.div layoutId="nav-underline" className="absolute -bottom-1 left-0 w-full h-[2px] bg-zhusha" />}
            </button>
          ))}

          <button
            onClick={toggleMusic}
            className={cn(
              'px-3.5 py-2 rounded-full border text-xs inline-flex items-center gap-2 transition-colors',
              musicOn ? 'border-zhusha bg-zhusha text-white' : 'border-ink/20 text-ink/75 hover:border-ink/35',
            )}
            title="古风背景音"
          >
            {musicOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            {musicOn ? '雅乐开启' : '雅乐关闭'}
          </button>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggleMusic}
            className={cn(
              'p-2 rounded-full border transition-colors',
              musicOn ? 'border-zhusha bg-zhusha text-white' : 'border-ink/20 text-ink/70',
            )}
            aria-label="toggle-music"
          >
            {musicOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button className="p-2 text-ink" onClick={() => setIsMenuOpen((v) => !v)} aria-label="menu">
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {!audioAvailable && (
        <div className="text-center text-xs py-2 text-zhusha bg-zhusha/10 border-b border-zhusha/20">当前浏览器不支持 Web Audio，古风背景音不可用。</div>
      )}

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            className="fixed inset-0 z-40 bg-paper/95 backdrop-blur-md pt-24 px-8 md:hidden"
          >
            <div className="flex flex-col gap-7">
              {NAV_ITEMS.map((item) => (
                <button key={item.id} onClick={() => goPage(item.id)} className="text-left">
                  <span className="text-4xl font-serif block">{item.title}</span>
                  <span className="text-xs uppercase tracking-widest opacity-50">{item.subtitle}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.main
          key={activePage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
        >
          {activePage === 'home' ? <HomePage onEnter={() => goPage('sunmao')} onNavigate={goPage} /> : <ModulePage page={activePage} />}
        </motion.main>
      </AnimatePresence>

      <footer className="bg-ink text-paper py-12 px-6 mt-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h2 className="text-2xl font-serif">境生·万象</h2>
            <p className="text-paper/60 text-sm mt-1 leading-7">以交互技术重塑中华文化体验，让传统在当代语境中持续生长。</p>
          </div>
          <div className="flex gap-3">
            <button className="p-3 bg-white/5 rounded-full hover:bg-zhusha transition-colors" aria-label="github-link">
              <Github className="w-5 h-5" />
            </button>
            <button className="p-3 bg-white/5 rounded-full hover:bg-zhusha transition-colors" aria-label="website-link">
              <Globe className="w-5 h-5" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
