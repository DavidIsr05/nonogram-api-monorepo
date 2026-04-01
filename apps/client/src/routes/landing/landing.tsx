import React from 'react';
import { BigLogo } from '../../assets';
import { Toaster } from 'sonner';
import { LoginForm } from './components';

export const Landing: React.FC = () => {
  return (
    <div className="bg-loginPagePurple h-screen w-full relative">
      <BigLogo className="h-screen w-full z-0 absolute right-[10%]" />
      <div className="bg-loginFormBackground w-full xl:w-[50%]  h-full inset-y-0 right-0 absolute z-10 xl:border-l-2 border-loginFormComponentBorder flex flex-col items-center justify-items-center gap-5 lg:gap-20">
        <div className="text-[2rem] sm:text-[3rem] pt-5 xl:pt-[20%]">
          Welcome to Pixelit!
        </div>
        <LoginForm />
      </div>
      <Toaster richColors />
    </div>
  );
};
