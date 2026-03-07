import React, { useEffect, useRef, useState } from 'react';
import { Camera, Play, RefreshCw, Share2, Download, Activity } from 'lucide-react';

type TrackState = {
  x: number;
  y: number;
  energy: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function StickFigureIndicator({ track }: { track: TrackState }) {
  const centerX = 60 + (track.x - 0.5) * 26;
  const centerY = 68 + (track.y - 0.5) * 24;
  const swing = 14 + track.energy * 24;

  return (
    <svg viewBox="0 0 120 120" className="w-24 h-24 mx-auto" aria-label="动作小人">
      <rect x="2" y="2" width="116" height="116" rx="12" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.16)" />
      <line x1="60" y1="108" x2="60" y2="90" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      <line x1="20" y1="98" x2="100" y2="98" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />

      <circle cx={centerX} cy={centerY - 24} r="8" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="3" />
      <line x1={centerX} y1={centerY - 16} x2={centerX} y2={centerY + 14} stroke="rgba(255,255,255,0.9)" strokeWidth="3" strokeLinecap="round" />
      <line x1={centerX} y1={centerY - 4} x2={centerX - swing} y2={centerY + 8} stroke="rgba(255,182,30,0.95)" strokeWidth="3" strokeLinecap="round" />
      <line x1={centerX} y1={centerY - 4} x2={centerX + swing} y2={centerY + 8} stroke="rgba(255,182,30,0.95)" strokeWidth="3" strokeLinecap="round" />
      <line x1={centerX} y1={centerY + 14} x2={centerX - 11} y2={centerY + 35} stroke="rgba(255,255,255,0.9)" strokeWidth="3" strokeLinecap="round" />
      <line x1={centerX} y1={centerY + 14} x2={centerX + 11} y2={centerY + 35} stroke="rgba(255,255,255,0.9)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export default function ShadowPuppetModule() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hiddenCanvasRef = useRef<HTMLCanvasElement>(null);
  const prevFrameRef = useRef<Uint8ClampedArray | null>(null);
  const trackRef = useRef<TrackState>({ x: 0.5, y: 0.5, energy: 0 });

  const [isTracking, setIsTracking] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [track, setTrack] = useState<TrackState>(trackRef.current);
  const [captureUrl, setCaptureUrl] = useState('');

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 960 },
          height: { ideal: 540 },
          facingMode: 'user',
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsTracking(true);
        setHasPermission(true);
      }
    } catch (err) {
      console.error('Camera error:', err);
      setHasPermission(false);
      setIsTracking(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((trackItem) => trackItem.stop());
      videoRef.current.srcObject = null;
    }
    prevFrameRef.current = null;
    const reset = { x: 0.5, y: 0.5, energy: 0 };
    trackRef.current = reset;
    setIsTracking(false);
    setTrack(reset);
  };

  const handleCapture = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setCaptureUrl(canvas.toDataURL('image/png'));
  };

  const handleDownload = () => {
    if (!captureUrl) return;
    const link = document.createElement('a');
    link.href = captureUrl;
    link.download = `shadow-puppet-${Date.now()}.png`;
    link.click();
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('页面链接已复制到剪贴板，可分享给朋友体验。');
    } catch {
      alert('复制失败，请手动复制当前页面链接。');
    }
  };

  useEffect(() => {
    if (!isTracking) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const hiddenCanvas = hiddenCanvasRef.current;
    if (!video || !canvas || !hiddenCanvas) return;

    const displayCtx = canvas.getContext('2d');
    const hiddenCtx = hiddenCanvas.getContext('2d', { willReadFrequently: true });
    if (!displayCtx || !hiddenCtx) return;

    let raf = 0;

    const drawPuppet = (ctx: CanvasRenderingContext2D, state: TrackState) => {
      const puppetX = state.x * ctx.canvas.width;
      const puppetY = state.y * ctx.canvas.height;
      const armSwing = (state.energy * 1.5 + 0.15) * Math.sin(Date.now() * 0.015);

      ctx.save();
      ctx.translate(puppetX, puppetY);
      ctx.fillStyle = 'rgba(15, 15, 15, 0.88)';

      ctx.beginPath();
      ctx.ellipse(0, -70, 32, 38, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(-24, -32, 48, 95);

      ctx.save();
      ctx.translate(24, -8);
      ctx.rotate(armSwing);
      ctx.fillRect(0, 0, 68, 10);
      ctx.restore();

      ctx.save();
      ctx.translate(-24, -8);
      ctx.rotate(-armSwing);
      ctx.fillRect(-68, 0, 68, 10);
      ctx.restore();

      ctx.fillStyle = 'rgba(255, 182, 30, 0.35)';
      const aura = 38 + state.energy * 90;
      ctx.beginPath();
      ctx.arc(0, -20, aura, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const tick = () => {
      const w = canvas.width;
      const h = canvas.height;

      displayCtx.clearRect(0, 0, w, h);
      displayCtx.fillStyle = '#111';
      displayCtx.fillRect(0, 0, w, h);

      hiddenCtx.drawImage(video, 0, 0, hiddenCanvas.width, hiddenCanvas.height);
      const frame = hiddenCtx.getImageData(0, 0, hiddenCanvas.width, hiddenCanvas.height);
      const curr = frame.data;
      const prev = prevFrameRef.current;

      let motionSum = 0;
      let weightedX = 0;
      let weightedY = 0;
      const stride = 4;
      const width = hiddenCanvas.width;

      if (prev) {
        for (let y = 0; y < hiddenCanvas.height; y += stride) {
          for (let x = 0; x < hiddenCanvas.width; x += stride) {
            const idx = (y * width + x) * 4;
            const currGray = (curr[idx] + curr[idx + 1] + curr[idx + 2]) / 3;
            const prevGray = (prev[idx] + prev[idx + 1] + prev[idx + 2]) / 3;
            const diff = Math.abs(currGray - prevGray);

            if (diff > 18) {
              motionSum += diff;
              weightedX += x * diff;
              weightedY += y * diff;
            }
          }
        }
      }

      prevFrameRef.current = new Uint8ClampedArray(curr);

      const current = trackRef.current;
      let targetX = current.x;
      let targetY = current.y;
      let energy = 0;
      if (motionSum > 0) {
        targetX = clamp(weightedX / motionSum / hiddenCanvas.width, 0.05, 0.95);
        targetY = clamp(weightedY / motionSum / hiddenCanvas.height, 0.12, 0.9);
        energy = clamp(motionSum / 120000, 0, 1);
      }

      const next: TrackState = {
        x: current.x * 0.75 + targetX * 0.25,
        y: current.y * 0.75 + targetY * 0.25,
        energy: current.energy * 0.78 + energy * 0.22,
      };

      drawPuppet(displayCtx, next);
      displayCtx.strokeStyle = 'rgba(255,255,255,0.25)';
      displayCtx.lineWidth = 1;
      displayCtx.strokeRect(14, 14, w - 28, h - 28);

      trackRef.current = next;
      setTrack(next);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isTracking]);

  useEffect(() => () => stopCamera(), []);

  return (
    <div className="w-full h-full relative bg-gradient-to-br from-[#19120f] via-[#1a1411] to-[#120f0d] rounded-3xl overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute inset-0 opacity-25 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')]" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_22%_22%,rgba(202,142,48,0.22),transparent_45%),radial-gradient(circle_at_80%_72%,rgba(180,66,47,0.2),transparent_42%)]" />

      <div className="relative w-full h-full flex items-center justify-center">
        <canvas ref={canvasRef} width={960} height={540} className="w-full h-full object-cover z-10" />
        <canvas ref={hiddenCanvasRef} width={240} height={135} className="hidden" />

        {!isTracking && (
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="text-center p-8 glass rounded-2xl max-w-md mx-4 border border-tenghuang/20">
              <p className="text-[10px] uppercase tracking-[0.26em] text-paper/55">Shadow Stage</p>
              <Camera className="w-12 h-12 text-paper mx-auto mt-2 mb-4" />
              <h3 className="text-2xl font-serif text-paper mb-2">入戏·非遗</h3>
              <p className="text-paper/70 text-sm mb-6 leading-relaxed">
                启动摄像头后，皮影会按你的动作能量与位移实时联动。动作越开阔，影偶越灵动。
              </p>
              <button onClick={startCamera} className="px-8 py-3 bg-zhusha text-white rounded-full font-medium inline-flex items-center gap-2 hover:scale-105 transition-transform">
                <Play className="w-4 h-4" /> 启幕体验
              </button>
              {hasPermission === false && <p className="text-xs text-red-300 mt-3">未获得摄像头权限，请在浏览器设置中允许访问。</p>}
            </div>
          </div>
        )}

        {isTracking && (
          <div className="absolute top-6 right-6 z-20 flex gap-2">
            <button onClick={stopCamera} className="p-3 glass rounded-full text-paper hover:bg-white/20 transition-colors" title="重置舞台">
              <RefreshCw className="w-5 h-5" />
            </button>
            <button onClick={handleCapture} className="p-3 glass rounded-full text-paper hover:bg-white/20 transition-colors" title="截图留影">
              <Camera className="w-5 h-5" />
            </button>
            <button onClick={handleShare} className="p-3 glass rounded-full text-paper hover:bg-white/20 transition-colors" title="分享页面">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        )}

        {captureUrl && (
          <div className="absolute bottom-6 right-6 z-20 bg-black/55 border border-white/20 rounded-xl p-2 w-44">
            <img src={captureUrl} alt="capture" className="w-full rounded" />
            <button onClick={handleDownload} className="mt-2 w-full text-xs py-1.5 rounded bg-zhusha text-white inline-flex items-center justify-center gap-1">
              <Download className="w-3.5 h-3.5" /> 下载留影
            </button>
          </div>
        )}

        {isTracking && (
          <div className="absolute bottom-6 left-6 w-56 z-20 glass rounded-xl p-3 text-paper/80 text-xs space-y-2 border border-tenghuang/20">
            <div className="flex items-center gap-2 text-paper">
              <Activity className="w-4 h-4" /> 动作能量
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-tenghuang transition-all" style={{ width: `${Math.round(track.energy * 100)}%` }} />
            </div>
            <StickFigureIndicator track={track} />
            <p className="text-[11px] text-paper/65 text-center leading-5">动作小人将实时反馈位移与节奏</p>
          </div>
        )}

        <video ref={videoRef} autoPlay playsInline muted className="hidden" />
      </div>

      <div className="absolute bottom-6 right-6 text-right z-20 pointer-events-none">
        <p className="text-[10px] text-paper/35 uppercase tracking-[0.2em]">AI Motion Shadow Puppetry</p>
      </div>
    </div>
  );
}
