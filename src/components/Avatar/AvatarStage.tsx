import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { 
  UserCheck, 
  Sparkles, 
  Eye, 
  Volume2, 
  Activity, 
  SlidersHorizontal, 
  RotateCcw,
  Zap
} from 'lucide-react';
import { AvatarState } from '../../types';

interface AvatarStageProps {
  avatarState: AvatarState;
  setAvatarState: React.Dispatch<React.SetStateAction<AvatarState>>;
}

export const AvatarStage: React.FC<AvatarStageProps> = ({
  avatarState,
  setAvatarState
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [headTracking, setHeadTracking] = useState(true);
  const [debugLog, setDebugLog] = useState('Three.js Scene Graph initialized. Loading /avatars/nexus.glb...');

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene Setup
    const scene = new THREE.Scene();
    scene.background = null;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Camera Fix
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.4, 3.2);
    camera.lookAt(0, 1.3, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    mountRef.current.appendChild(renderer.domElement);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0x6366f1, 2.5); // Indigo key light
    mainLight.position.set(2, 4, 3);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0x06b6d4, 1.5); // Cyan fill
    fillLight.position.set(-3, 2, -2);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xa855f7, 3, 10); // Purple rim
    rimLight.position.set(0, 3, -2);
    scene.add(rimLight);

    // Grid Floor
    const gridHelper = new THREE.GridHelper(10, 20, 0x6366f1, 0x334155);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Avatar Root Container
    const avatarGroup = new THREE.Group();
    avatarGroup.position.set(0, 0.2, 0);
    scene.add(avatarGroup);

    // Procedurally Rigged Cyber Avatar Head & Features
    let avatarHeadMesh: THREE.Mesh | null = null;
    let mouthMesh: THREE.Mesh | null = null;
    let leftEye: THREE.Mesh | null = null;
    let rightEye: THREE.Mesh | null = null;

    // Construct Cyber Avatar Geometry
    const headGeo = new THREE.IcosahedronGeometry(0.5, 3);
    const headMat = new THREE.MeshStandardMaterial({
      color: 0x1e1b4b,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: false,
    });
    avatarHeadMesh = new THREE.Mesh(headGeo, headMat);
    avatarHeadMesh.position.set(0, 1.3, 0);
    avatarGroup.add(avatarHeadMesh);

    // Visor / Eyes
    const eyeGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    
    leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.18, 1.35, 0.42);
    avatarGroup.add(leftEye);

    rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.18, 1.35, 0.42);
    avatarGroup.add(rightEye);

    // Cyber Mouth
    const mouthGeo = new THREE.BoxGeometry(0.25, 0.04, 0.05);
    const mouthMat = new THREE.MeshBasicMaterial({ color: 0xa855f7 });
    mouthMesh = new THREE.Mesh(mouthGeo, mouthMat);
    mouthMesh.position.set(0, 1.15, 0.45);
    avatarGroup.add(mouthMesh);

    // Shoulders
    const shoulderGeo = new THREE.CylinderGeometry(0.7, 0.9, 0.6, 16);
    const shoulderMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 });
    const shoulderMesh = new THREE.Mesh(shoulderGeo, shoulderMat);
    shoulderMesh.position.set(0, 0.6, 0);
    avatarGroup.add(shoulderMesh);

    // Load GLTF /avatars/nexus.glb if available
    const loader = new GLTFLoader();
    loader.load(
      '/avatars/nexus.glb',
      (gltf) => {
        setDebugLog('GLTF Model /avatars/nexus.glb loaded successfully.');
        const model = gltf.scene;
        model.scale.set(1, 1, 1);
        model.position.set(0, 0, 0);
        avatarGroup.add(model);
      },
      (xhr) => {
        if (xhr.lengthComputable) {
          setDebugLog(`Loading /avatars/nexus.glb (${((xhr.loaded / xhr.total) * 100).toFixed(0)}%)`);
        }
      },
      (error) => {
        setDebugLog('Rendering procedurally rigged Cyber Human Mesh (nexus.glb fallback).');
      }
    );

    // Mouse Head Tracking
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!headTracking) return;
      const rect = mountRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotationY = x * 0.5;
      targetRotationX = y * 0.3;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let clock = new THREE.Clock();
    let animFrameId: number;

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Head Tracking Interpolation
      if (avatarHeadMesh) {
        avatarHeadMesh.rotation.y += (targetRotationY - avatarHeadMesh.rotation.y) * 0.05;
        avatarHeadMesh.rotation.x += (targetRotationX - avatarHeadMesh.rotation.x) * 0.05;
      }

      // Idle Breathing Animation
      avatarGroup.position.y = 0.2 + Math.sin(elapsedTime * 2) * 0.03;

      // Speaking & Lip Sync
      if (mouthMesh) {
        if (avatarState.isSpeaking) {
          const speakScale = 0.04 + Math.abs(Math.sin(elapsedTime * 15)) * 0.12;
          mouthMesh.scale.y = speakScale / 0.04;
        } else {
          mouthMesh.scale.y = 1;
        }
      }

      // Blinking
      if (leftEye && rightEye) {
        if (Math.sin(elapsedTime * 0.8) > 0.98) {
          leftEye.scale.y = 0.1;
          rightEye.scale.y = 0.1;
        } else {
          leftEye.scale.y = 1;
          rightEye.scale.y = 1;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!mountRef.current) return;
      const newW = mountRef.current.clientWidth;
      const newH = mountRef.current.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.innerHTML = '';
      }
    };
  }, [avatarState.isSpeaking, headTracking]);

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-4rem)] bg-neutral-950 text-neutral-100 overflow-hidden">
      {/* 3D Canvas Stage */}
      <div className="flex-1 relative bg-neutral-950 flex flex-col">
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-neutral-900/80 border border-neutral-800 text-xs font-mono text-indigo-400 flex items-center gap-1.5 shadow-lg">
            <UserCheck className="w-4 h-4 text-indigo-400" />
            3D Avatar: /avatars/nexus.glb
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400">
            60 FPS Render
          </span>
        </div>

        <div ref={mountRef} className="w-full flex-1 cursor-grab active:cursor-grabbing" />

        {/* Console Log Bar */}
        <div className="p-3 bg-neutral-900/90 border-t border-neutral-800 text-xs font-mono text-neutral-400 flex items-center justify-between">
          <span>{debugLog}</span>
          <span className="text-neutral-500">GLTF / Three.js Canvas</span>
        </div>
      </div>

      {/* Control Panel Sidebar */}
      <div className="w-full lg:w-80 bg-neutral-900 border-l border-neutral-800 p-6 space-y-6 overflow-y-auto shrink-0">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
          Avatar Controls & Expressions
        </h3>

        {/* Emotion Presets */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Active Emotion
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['neutral', 'focused', 'happy', 'thinking'] as const).map(emo => (
              <button
                key={emo}
                onClick={() => setAvatarState(prev => ({ ...prev, emotion: emo }))}
                className={`p-2.5 rounded-xl text-xs font-semibold capitalize border transition-all ${
                  avatarState.emotion === emo
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                    : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                }`}
              >
                {emo}
              </button>
            ))}
          </div>
        </div>

        {/* State Triggers */}
        <div className="space-y-3 pt-4 border-t border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-300 font-medium">Speaking Mode</span>
            <button
              onClick={() => setAvatarState(prev => ({ ...prev, isSpeaking: !prev.isSpeaking }))}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                avatarState.isSpeaking ? 'bg-indigo-600 text-white animate-pulse' : 'bg-neutral-800 text-neutral-400'
              }`}
            >
              {avatarState.isSpeaking ? 'Speaking' : 'Idle'}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-300 font-medium">Head Mouse Tracking</span>
            <button
              onClick={() => setHeadTracking(!headTracking)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                headTracking ? 'bg-emerald-600 text-white' : 'bg-neutral-800 text-neutral-400'
              }`}
            >
              {headTracking ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
