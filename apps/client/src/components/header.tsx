import React from 'react';
import Logo from '../assets/images/logo.svg?react';
import Games from '../assets/images/games.svg?react';
import Profile from '../assets/images/profile.svg?react';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  return (
    <div className="w-screen h-[9%] flex flex-row gap-[1%] items-center bg-gradient-to-r from-gradientStartYellow to-gradientEndPurple">
      <Link to="/home" className="h-full">
        <Logo className="h-full aspect-auto" />
      </Link>
      <Link to="/games" className="ml-auto h-[90%]">
        <Games className="h-full" />
      </Link>
      <Link to="/profile" className="h-[90%]">
        <Profile className="h-full" />
      </Link>
    </div>
  );
};
