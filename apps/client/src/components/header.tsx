import React from 'react';
import { Link } from 'react-router-dom';
import { Profile, Games, Logo } from '../assets';

export const Header: React.FC = () => {
  return (
    <div className="w-screen h-[9%] flex flex-row gap-[1%] items-center bg-gradient-to-r from-gradientStartYellow to-gradientEndPurple">
      <Link to="/home" className="h-full overflow-hidden">
        <Logo className="h-full aspect-auto hover:scale-105 active:scale-100 transition-transform" />
      </Link>
      <Link
        to="/games"
        className="ml-auto h-[90%] hover:scale-105 active:scale-95 transition-transform"
      >
        <Games className="h-full" />
      </Link>
      <Link
        to="/profile"
        className="h-[90%] mr-3 hover:scale-105 active:scale-95 transition-transform"
      >
        <Profile className="h-full" />
      </Link>
    </div>
  );
};
