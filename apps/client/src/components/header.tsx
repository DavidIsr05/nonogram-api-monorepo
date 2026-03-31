import React from 'react';
import { Link } from 'react-router-dom';
import { Profile, Games, Logo } from '../assets';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@nonogram-api-monorepo/ui-kit';

export const Header: React.FC = () => {
  return (
    <div className="w-screen h-[9%] flex flex-row gap-[1%] items-center bg-gradient-to-r from-gradientStartYellow to-gradientEndPurple">
      <Tooltip>
        <TooltipTrigger asChild>
          <Link to="/home" className="h-full overflow-hidden">
            <Logo className="h-full aspect-auto hover:scale-105 active:scale-100 transition-transform" />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <span>Home</span>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to="/games"
            className="ml-auto h-[90%] hover:scale-105 active:scale-95 transition-transform"
          >
            <Games className="h-full" />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <span>My games</span>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to="/profile"
            className="h-[90%] mr-3 hover:scale-105 active:scale-95 transition-transform"
          >
            <Profile className="h-full" />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <span>Profile</span>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
