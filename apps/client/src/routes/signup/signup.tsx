import React from 'react';
import { BigLogo } from '../../assets/images';
import { Toaster } from 'sonner';
import { SignupForm } from './components';

export const Signup: React.FC = () => {
  return (
    <div className="bg-signupPageOrange h-screen w-screen relative">
      <BigLogo className="h-screen w-screen absolute z-0 right-[10%]" />
      <div className="bg-signupFormBackground w-[50%]  h-screen inset-y-0 right-0 absolute z-10 border-l-2 border-signupPageOrange flex flex-col items-center  gap-[6rem]">
        <div className="text-[3rem] pt-[20%]">Create an account!</div>
        <SignupForm />
      </div>
      <Toaster richColors />
    </div>
  );
};
