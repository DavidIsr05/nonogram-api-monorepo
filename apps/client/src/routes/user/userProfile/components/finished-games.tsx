import { FinishedGamesResponseType } from '@nonogram-api-monorepo/types';
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Card,
  CardContent,
} from '@nonogram-api-monorepo/ui-kit';
import { useNavigate } from 'react-router-dom';

type Props = { finishedGames: FinishedGamesResponseType[] }; //max-w-full sm:max-w-[15%]

export const FinishedGames: React.FC<Props> = ({ finishedGames }) => {
  const navigate = useNavigate();

  const handleClick = (gameId: string) => {
    navigate(`/game/${gameId}`);
    return null;
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <Carousel className="w-[50%]">
      <CarouselContent>
        {finishedGames.map(({ timer, mistakes, nonogram, isLiked, id }) => (
          <CarouselItem
            key={id}
            className="basis-1/3"
            onClick={() => {
              handleClick(id);
            }}
          >
            <div className="p-1">
              <Card className="w-full h-full bg-globalLeaderboardsBackground/20 ring-0 border rounded-2xl shadow-md">
                <CardContent className="flex flex-col aspect-square items-center p-2 gap-5">
                  <img
                    src={`data:image/png;base64,${nonogram.completeNonogramImageBase64}`}
                    alt="complete game preview image"
                    className="w-[80%]"
                  />
                  <div className="flex flex-row gap-5">
                    <span className="font-bold">{nonogram.name}</span>
                    <span>⏱️ : {formatTime(timer)}</span>
                    <span>❌ : {mistakes}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};
