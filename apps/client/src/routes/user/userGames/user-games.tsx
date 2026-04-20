import { GameSelector, Header } from '../../../components';
import React from 'react';
import { GameList, GameListHeader } from './components';

export const UserGames: React.FC = () => {
  return (
    <div className="h-screen w-full items-center flex flex-col bg-default bg-center bg-repeat">
      <Header />
      <div className="h-[90%] w-full flex flex-row items-center justify-around">
        <GameSelector
          name="Recent Games:"
          renderList={(difficulty) => <GameList difficulty={difficulty} />}
          NonogramCreationPopup={null}
        >
          <GameListHeader />
        </GameSelector>
      </div>
    </div>
  );
};
