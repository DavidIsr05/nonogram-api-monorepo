import {
  FinishedGamesResponseType,
  MISTAKES_THRESHOLD,
} from '@nonogram-api-monorepo/types';
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Card,
  CardContent,
} from '@nonogram-api-monorepo/ui';
import { useNavigate } from 'react-router-dom';
import { Like } from '../../../../assets';
import { formatTime } from '../../../../utils';

type Props = { finishedGames: FinishedGamesResponseType[] };

export const FinishedGames: React.FC<Props> = ({ finishedGames }) => {
  const navigate = useNavigate();

  const handleClick = (gameId: string) => {
    navigate(`/game/${gameId}`);
    return null;
  };

  return finishedGames[0] ? (
    <Carousel className="w-[90%] select-none" orientation="horizontal">
      <CarouselContent>
        {finishedGames.map(({ timer, mistakes, nonogram, isLiked, id }) => {
          const likeIconFill = isLiked
            ? 'fill-absoluteBlack/30'
            : 'fill-absoluteWhite';

          return (
            <CarouselItem
              key={id}
              className="basis-1/4 xl:basis-1/6 cursor-pointer"
              onClick={() => {
                handleClick(id);
              }}
            >
              <div className="p-1">
                <Card className="w-full h-full bg-globalLeaderboards/20 ring-0 border rounded-2xl shadow-md">
                  <CardContent className="flex flex-col aspect-square items-center p-1 gap-3">
                    <img
                      src={`data:image/png;base64,${nonogram.completeNonogramImageBase64}`}
                      alt="complete game preview"
                      className="w-[90%]"
                    />
                    <span className="font-bold">{nonogram.name}</span>
                    <div className="flex flex-row gap-3 items-center">
                      <span role="img" aria-label="timer emoji">
                        ⏱️: {formatTime(timer)}
                      </span>
                      <span role="img" aria-label="mistake emoji">
                        ❌: {mistakes}/{MISTAKES_THRESHOLD}
                      </span>
                      <Like
                        className={`aspect-square h-[40%] ${likeIconFill}`}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ) : (
    <span className="items-center text-4xl text-absoluteBlack/40">
      You did not finish any games yet...
    </span>
  );
};
