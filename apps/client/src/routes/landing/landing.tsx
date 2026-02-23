import React from 'react';
import bigLogo from '../../assets/images/bigLogo.svg';
import { LoginForm } from './components/login-form';
import { Toaster } from 'sonner';

export const Landing: React.FC = () => {
  return (
    <div className="bg-[#DA6DE4] h-screen w-screen relative">
      <img
        src={bigLogo}
        className="h-screen w-screen absolute z-0 right-[15vh]"
        alt="Project logo"
      />
      <div className="bg-[#F5E6FA] w-1/2  h-screen inset-y-0 right-0 absolute z-10 border-l-2 border-[#A90FB8] flex flex-col items-center  gap-[6rem]">
        <div className="text-[3rem] pt-[10rem]">Welcome to Pixelit!</div>
        <LoginForm />
      </div>
      <Toaster richColors />
    </div>
  );
};
