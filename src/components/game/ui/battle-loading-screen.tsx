'use client';

import { useEffect, useState } from 'react';

interface BattleLoadingScreenProps {
  isLoading: boolean;
  progress: number;
}

const LOADING_MESSAGES = [
  'Entering battle area...',
  'Loading tactical map...',
  'Establishing satellite connection...',
  'Deploying units...',
  'Synchronizing control points...',
  'Preparing battlefield...',
  'Loading arsenal...',
  'Initializing combat systems...',
  'Almost ready...',
];

export function BattleLoadingScreen({ isLoading, progress }: BattleLoadingScreenProps) {
  const [currentMessage, setCurrentMessage] = useState(LOADING_MESSAGES[0]);
  const [dots, setDots] = useState('');

  useEffect(() => {
    const messageIndex = Math.min(
      Math.floor((progress / 100) * LOADING_MESSAGES.length),
      LOADING_MESSAGES.length - 1
    );
    setCurrentMessage(LOADING_MESSAGES[messageIndex]);
  }, [progress]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-8">
        <div className="relative">
          <div className="w-32 h-32 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-4xl font-bold text-orange-500">
              {Math.round(progress)}%
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="text-2xl font-bold text-white tracking-wider">
            DROPZONE BATTLEFIELD
          </div>

          <div className="h-8 flex items-center">
            <div className="text-lg text-orange-400 font-mono min-w-[400px] text-center">
              {currentMessage}{dots}
            </div>
          </div>

          <div className="w-96 h-2 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-600 to-orange-400 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="absolute bottom-8 text-sm text-neutral-500 font-mono">
          Powered by real-time satellite imagery
        </div>
      </div>
    </div>
  );
}
