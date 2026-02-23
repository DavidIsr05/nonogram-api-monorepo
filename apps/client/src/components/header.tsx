import React from 'react';
import logo from '../assets/images/logo.svg';
import games from '../assets/images/games.svg';
import profile from '../assets/images/profile.svg';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  return (
    <div className="w-screen h-[9%] flex flex-row gap-[1%] items-center bg-gradient-to-r from-[#e8ae48] to-[#c95ddc]">
      <Link to="/home" className="h-full">
        <img src={logo} alt="Project logo" className="h-full" />
      </Link>
      <Link to="/games" className="ml-auto h-[90%]">
        <img src={games} alt="joystick/games button" className="h-full" />
      </Link>
      <Link to="/profile" className="h-[90%]">
        <img src={profile} alt="profile button" className="h-full" />
      </Link>
    </div>
  );
};
