import React from 'react';
import { Header } from '../../components';
import { GlobalLeaderboard } from './components/global-leaderboard';
import { Toaster } from 'sonner';

export const Home: React.FC = () => {
  return (
    <div className="h-screen w-screen ">
      <Header />
      <div className="h-[90%] w-[90%] flex flex-row">
        <GlobalLeaderboard />
      </div>
      <Toaster richColors />
    </div>
  );
};
