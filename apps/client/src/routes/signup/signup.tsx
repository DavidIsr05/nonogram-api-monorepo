import React from 'react';
import { BigLogo } from '../../assets';
import { Toaster } from 'sonner';
import { SignupForm } from './components';

export const Signup: React.FC = () => {
  return (
    <div className="bg-signupPageOrange h-screen w-screen relative">
      <BigLogo className="h-screen w-screen absolute z-0 right-[10%]" />
      <div className="bg-signupFormBackground w-full xl:w-[50%]  h-screen inset-y-0 right-0 absolute z-10 xl:border-l-2 border-signupPageOrange flex flex-col items-center  gap-5 lg:gap-20">
        <div className="text-[2rem] lg:text-[3rem] pt-5 xl:pt-[20%]">
          Create an account!
        </div>
        <SignupForm />
      </div>
      <Toaster richColors />
    </div>
  );
};
