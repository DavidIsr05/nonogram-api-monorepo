import React from 'react';
import bigLogo from '../../assets/images/bigLogo.svg';
import { Toaster } from 'sonner';
import { SignupForm } from './components';

export const Signup: React.FC = () => {
  return (
    <div className="bg-[#F5A623] h-screen w-screen relative">
      <img
        src={bigLogo}
        className="h-screen w-screen absolute z-0 right-[15vh]"
        alt="Project logo"
      />
      <div className="bg-[#FFF6E5] w-1/2  h-screen inset-y-0 right-0 absolute z-10 border-l-2 border-[#F5A623] flex flex-col items-center  gap-[6rem]">
        <div className="text-[3rem] pt-[10rem]">Create an account!</div>
        <SignupForm />
      </div>
      <Toaster richColors />
    </div>
  );
};
