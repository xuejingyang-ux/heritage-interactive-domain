import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

type Part = {
  id: string;
  label: string;
  color: string;
  position: [number, number, number];
  size: [number, number, number];
  explode: [number, number, number];
};

type JointConfig = {
  id: string;
  name: string;
  detail: string;
  parts: Part[];
};

const JOINTS: JointConfig[] = [
  {
    id: 'dovetail',
    name: '燕尾榫',
    detail: '抗拉能力强，常用于抽屉与框体连接。',
    parts: [
      { id: 'base', label: '榫眼件', color: '#8B5A2B', position: [0, -0.5, 0], size: [2.6, 1.0, 1.2], explode: [0, -0.8, 0] },
      { id: 'tenon', label: '榫舌件', color: '#A86B3D', position: [0, 0.55, 0], size: [1.8, 0.9, 1.0], explode: [0, 1.1, 0] },
      { id: 'wedge-l', label: '锁楔左', color: '#6E4022', position: [-0.45, 1.0, 0], size: [0.36, 0.6, 0.9], explode: [-0.85, 1.45, 0] },
      { id: 'wedge-r', label: '锁楔右', color: '#6E4022', position: [0.45, 1.0, 0], size: [0.36, 0.6, 0.9], explode: [0.85, 1.45, 0] },
    ],
  },
  {
    id: 'through',
    name: '穿带榫',
    detail: '横向贯通连接，常见于梁柱与横枨。',
    parts: [
      { id: 'beam', label: '横梁', color: '#8D5935', position: [0, 0, 0], size: [3.2, 0.75, 0.9], explode: [0, 0, 0] },
      { id: 'column', label: '立柱', color: '#B17344', position: [0, -0.05, 0], size: [1.0, 2.6, 1.0], explode: [0, -1.2, 0] },
      { id: 'pin', label: '木销', color: '#603813', position: [0, 0.55, 0], size: [0.25, 0.75, 0.25], explode: [0, 1.7, 0] },
    ],
  },
  {
    id: 'miter',
    name: '抱肩榫',
    detail: '用于转角抱合，保证稳定并兼顾美观。',
    parts: [
      { id: 'arm-a', label: '构件A', color: '#8A5B3C', position: [-0.55, 0, 0], size: [1.8, 0.8, 1.0], explode: [-1.5, 0, 0] },
      { id: 'arm-b', label: '构件B', color: '#A06840', position: [0.55, 0, 0], size: [1.8, 0.8, 1.0], explode: [1.5, 0, 0] },
      { id: 'key', label: '抱肩锁键', color: '#5D341A', position: [0, 0.7, 0], size: [0.35, 0.7, 0.35], explode: [0, 1.6, 0] },
    ],
  },
];

function SunmaoPart({ part, explodeRatio, highlighted }: { part: Part; explodeRatio: number; highlighted: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!meshRef.current) return;
    const target = new THREE.Vector3(
      part.position[0] + part.explode[0] * explodeRatio,
      part.position[1] + part.explode[1] * explodeRatio,
      part.position[2] + part.explode[2] * explodeRatio,
    );
    meshRef.current.position.lerp(target, 0.12);
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <boxGeometry args={part.size} />
      <meshStandardMaterial color={part.color} roughness={0.38} metalness={0.08} emissive={highlighted ? '#2A1408' : '#000000'} />
    </mesh>
  );
}

function StructureScene({ joint, explodeRatio, focusPartId }: { joint: JointConfig; explodeRatio: number; focusPartId: string }) {
  return (
    <group>
      {joint.parts.map((part) => (
        <SunmaoPart key={part.id} part={part} explodeRatio={explodeRatio} highlighted={focusPartId === part.id} />
      ))}
    </group>
  );
}

export default function SunmaoModule() {
  const [jointId, setJointId] = useState(JOINTS[0].id);
  const [explode, setExplode] = useState(false);
  const [step, setStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

  const activeJoint = useMemo(() => JOINTS.find((joint) => joint.id === jointId) || JOINTS[0], [jointId]);
  const maxStep = activeJoint.parts.length;

  const explodeRatio = explode ? Math.max(step / Math.max(maxStep, 1), 0.1) : 0;
  const focusPartId = step > 0 ? activeJoint.parts[Math.min(step - 1, activeJoint.parts.length - 1)]?.id || '' : '';

  React.useEffect(() => {
    if (!autoPlay) return;
    const timer = window.setInterval(() => {
      setExplode(true);
      setStep((prev) => {
        if (prev >= maxStep) return 0;
        return prev + 1;
      });
    }, 1200);
    return () => window.clearInterval(timer);
  }, [autoPlay, maxStep]);

  React.useEffect(() => {
    setStep(0);
    setExplode(false);
    setAutoPlay(false);
  }, [jointId]);

  const currentStepText = step === 0 ? '整体观察' : `第 ${step} 步：${activeJoint.parts[step - 1].label}`;
  const progress = Math.round((step / Math.max(maxStep, 1)) * 100);
  const currentPart = step > 0 ? activeJoint.parts[Math.min(step - 1, activeJoint.parts.length - 1)] : null;

  return (
    <div className="w-full h-full bg-gradient-to-br from-paper via-[#f0e6d8] to-[#e6d8c4] rounded-3xl overflow-hidden border border-ink/10 flex flex-col lg:flex-row">
      <div className="w-full lg:w-64 shrink-0 flex flex-col gap-3 p-5 bg-paper/90 border-b lg:border-b-0 lg:border-r border-ink/10 overflow-y-auto">
        <div className="rounded-xl border border-ink/10 bg-white/55 p-4">
          <p className="text-[10px] uppercase tracking-[0.22em] text-ochre/80">Craft Anatomy</p>
          <h3 className="text-2xl font-serif module-title mt-1">解构·匠心</h3>
          <p className="text-xs text-ink/65 mt-1 leading-relaxed">选取榫卯谱型，按步骤拆解以观察受力关系与咬合路径。</p>
        </div>

        <div className="rounded-xl border border-ink/10 bg-white/55 p-3">
          <p className="text-[11px] tracking-[0.15em] uppercase text-ink/45 mb-2">榫型谱录</p>
          <div className="flex flex-wrap gap-2">
            {JOINTS.map((joint) => (
              <button
                key={joint.id}
                onClick={() => setJointId(joint.id)}
                className={`px-3 py-1 rounded-full text-xs border transition-colors ${jointId === joint.id ? 'bg-ink text-paper border-ink' : 'border-ink/20 hover:border-ink/40 bg-white/40'}`}
              >
                {joint.name}
              </button>
            ))}
          </div>
          <p className="text-xs text-ink/60 mt-2 leading-relaxed">{activeJoint.detail}</p>
        </div>

        <div className="rounded-xl border border-ink/10 bg-white/55 p-3">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-ink/55">拆解进度</span>
            <span className="text-zhusha">{progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-ink/10 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-tenghuang to-zhusha transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-zhusha mt-2">{currentStepText}</p>
          <p className="text-xs text-ink/60 mt-1">当前构件：{currentPart ? currentPart.label : '未选中'}</p>
        </div>

        <div className="rounded-xl border border-ink/10 bg-white/55 p-3 flex flex-col gap-2">
          <button
            onClick={() => {
              if (explode) {
                setExplode(false);
                setStep(0);
                return;
              }
              setExplode(true);
              if (step === 0) setStep(1);
            }}
            className="w-full px-4 py-2 bg-ink text-paper rounded-full text-xs hover:bg-dailan transition-colors"
          >
            {explode ? '复归合榫' : '启拆一览'}
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className="flex-1 px-3 py-2 border border-ink/20 rounded-full text-xs bg-white/45 hover:bg-white/70 transition-colors"
            >
              回看上步
            </button>
            <button
              onClick={() => {
                setExplode(true);
                setStep((s) => Math.min(maxStep, s + 1));
              }}
              className="flex-1 px-3 py-2 border border-ink/20 rounded-full text-xs bg-white/45 hover:bg-white/70 transition-colors"
            >
              推进一步
            </button>
          </div>
          <button
            onClick={() => setAutoPlay((v) => !v)}
            className={`w-full px-4 py-2 rounded-full text-xs transition-colors ${autoPlay ? 'bg-zhusha text-white' : 'border border-ink/20 bg-white/45 hover:bg-white/70'}`}
          >
            {autoPlay ? '停止巡演' : '自动巡演'}
          </button>
          <p className="text-[11px] text-ochre/90 leading-5 mt-1">榫卯之妙，在于相咬相让，藏力于无钉之间。</p>
        </div>
      </div>

      <div className="flex-1 relative min-h-[430px]">
        <Canvas shadows dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[5.2, 4.8, 5.4]} fov={45} />
          <ambientLight intensity={0.6} />
          <pointLight position={[8, 8, 8]} intensity={1.1} castShadow />
          <spotLight position={[-8, 10, 7]} angle={0.35} penumbra={0.8} intensity={0.9} />

          <StructureScene joint={activeJoint} explodeRatio={explodeRatio} focusPartId={focusPartId} />
          <ContactShadows position={[0, -2.3, 0]} opacity={0.32} scale={11} blur={2.4} far={5.5} />
          <OrbitControls enablePan={false} minDistance={4} maxDistance={9} maxPolarAngle={Math.PI / 1.8} />
        </Canvas>
        <div className="absolute bottom-4 right-4 text-right pointer-events-none">
          <span className="text-[10px] uppercase tracking-widest opacity-35">Web3D Mortise Demo</span>
        </div>
      </div>
    </div>
  );
}
