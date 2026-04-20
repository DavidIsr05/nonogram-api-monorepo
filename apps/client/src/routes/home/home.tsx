import React, { useState } from 'react';
import { GameSelector, Header } from '../../components';
import { Toaster } from 'sonner';
import {
  GlobalLeaderboard,
  NonogramList,
  CreateNonogramPopup,
  NonogramListHeader,
} from './components';

export const Home: React.FC = () => {
  const [isDisplayAllNonograms, setIsDisplayAllNonograms] = useState(true);

  return (
    <div className="h-screen w-full items-center flex flex-col bg-default bg-repeat overflow-auto">
      <Header />
      <div className="h-[90%] w-full flex flex-col-reverse lg:flex-row items-center justify-around p-3 lg:p-0 gap-5 lg:gap-0">
        <GlobalLeaderboard />
        <GameSelector
          name="Nonograms:"
          renderList={(difficulty) => (
            <NonogramList
              isDisplayAllNonograms={isDisplayAllNonograms}
              difficulty={difficulty}
            />
          )}
          NonogramCreationPopup={CreateNonogramPopup}
        >
          <NonogramListHeader
            setIsDisplayAllNonograms={setIsDisplayAllNonograms}
            isDisplayAllNonograms={isDisplayAllNonograms}
          />
        </GameSelector>
      </div>
      <Toaster richColors />
    </div>
  );
};
