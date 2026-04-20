import { Separator } from '@nonogram-api-monorepo/ui';
import React from 'react';

export const GameListHeader: React.FC = () => {
  return (
    <div className="cursor-pointer grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-center mb-2 rounded-lg p-4 backdrop-blur-lg bg-absoluteWhite/30 text-lg">
      <span className="text-center font-bold">Nonogram Name</span>
      <Separator orientation="vertical" className="w-full h-full" />
      <span className="text-center" role="img" aria-label="timer emoji">
        ⏱️ Timer
      </span>
      <Separator orientation="vertical" className="w-full h-full" />
      <span className="text-center" role="img" aria-label="mistakes emoji">
        ❌ Mistakes Count
      </span>
      <Separator orientation="vertical" className="w-full h-full" />
      <span className="text-center" role="img" aria-label="size emoji">
        📐 Size
      </span>
    </div>
  );
};
