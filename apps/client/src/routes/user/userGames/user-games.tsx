import { GameSelector, Header } from '../../../components';
import React from 'react';
import { GameList } from './components';

export const UserGames: React.FC = () => {
  return (
    <div className="h-screen w-screen items-center flex flex-col bg-default bg-center bg-repeat">
      <Header />
      <div className="h-[90%] w-full flex flex-row items-center justify-around">
        <GameSelector
          name="Your Games:"
          renderList={(difficulty) => <GameList difficulty={difficulty} />}
          NonogramCreationPopup={null}
        />
      </div>
    </div>
  );
};
