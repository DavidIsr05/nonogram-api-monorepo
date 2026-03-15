import React from 'react';
import { BigLogo } from '../../assets';
import { Toaster } from 'sonner';
import { LoginForm } from './components';

export const Landing: React.FC = () => {
  return (
    <div className="bg-loginPagePurple h-screen w-screen relative">
      <BigLogo className="h-screen w-screen z-0 absolute right-[10%]" />
      <div className="bg-loginFormBackground w-[50%]  h-full inset-y-0 right-0 absolute z-10 border-l-2 border-loginFormComponentBorder flex flex-col items-center  gap-[6rem]">
        <div className="text-[3rem] pt-[20%]">Welcome to Pixelit!</div>
        <LoginForm />
      </div>
      <Toaster richColors />
    </div>
  );
};
