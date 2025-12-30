'use client';

import { ReactNode } from 'react';
import { useGameActions } from '@/contexts/game/game-actions-context';

interface GameSidebarProps {
  children: ReactNode;
}

export function GameSidebar({ children }: GameSidebarProps) {
  const { sidebarRef } = useGameActions();

  return (
    <div
      ref={sidebarRef}
      className="w-80 bg-black/70 backdrop-blur-sm border-r border-gray-800 flex flex-col overflow-y-auto"
      style={{ scrollbarWidth: 'thin', scrollbarColor: '#4b5563 #1f2937' }}
    >
      {children}
    </div>
  );
}
