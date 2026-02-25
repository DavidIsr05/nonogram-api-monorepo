import React from 'react';
import { Header } from '../../components';
import { Toaster } from 'sonner';
import { GlobalLeaderboard, Nonograms } from './components';

export const Home: React.FC = () => {
  return (
    <div className="h-screen w-screen items-center flex flex-col">
      <Header />
      <div className="h-[90%] w-[95%] flex flex-row items-center justify-between">
        <GlobalLeaderboard />
        <Nonograms />
      </div>
      <Toaster richColors />
    </div>
  );
};
