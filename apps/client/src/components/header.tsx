import React from 'react';
import { Link } from 'react-router-dom';
import { Profile, Games, Logo } from '../assets';
import {
  Separator,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@nonogram-api-monorepo/ui';
import goldenRouteLogo from '../assets/images/golden-route-logo.png';

export const Header: React.FC = () => {
  return (
    <div className="w-full h-[9%] flex flex-row gap-[1%] items-center bg-gradient-to-r from-gradientStartYellow to-gradientEndPurple pr-[0.5%]">
      <Tooltip>
        <TooltipTrigger asChild>
          <Link to="/home" className="h-full overflow-hidden">
            <Logo className="translate-x-0 h-full aspect-auto hover:scale-105 active:scale-100 transition-transform" />
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
          <span>Recent games</span>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to="/profile"
            className="h-[90%] hover:scale-105 active:scale-95 transition-transform"
          >
            <Profile className="h-full" />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <span>Profile</span>
        </TooltipContent>
      </Tooltip>
      <Separator
        orientation="vertical"
        className="h-[80%] border-absoluteBlack/50"
      />
      <div className="group h-[90%] aspect-square cursor-pointer">
        <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
          <div className="flex items-center justify-center [backface-visibility:hidden]">
            <img
              src={goldenRouteLogo}
              alt="team logo"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="absolute inset-0 flex items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-[1vw] text-orange-400 [backface-visibility:hidden] [transform:rotateY(180deg)]">
            Golden Route Team
          </span>
        </div>
      </div>
    </div>
  );
};
