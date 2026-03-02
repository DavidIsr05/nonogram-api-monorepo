import React from 'react';
import { GameSelector, Header } from '../../components';
import { Toaster } from 'sonner';
import {
  GlobalLeaderboard,
  NonogramList,
  CreateNonogramPopup,
} from './components';

export const Home: React.FC = () => {
  return (
    <div className="h-screen w-screen items-center flex flex-col">
      <Header />
      <div className="h-[90%] w-full flex flex-row items-center justify-around">
        <GlobalLeaderboard />
        <GameSelector
          name="Nonograms:"
          renderList={(difficulty) => <NonogramList difficulty={difficulty} />}
          NonogramCreationPopup={CreateNonogramPopup}
        />
      </div>
      <Toaster richColors />
    </div>
  );
};
