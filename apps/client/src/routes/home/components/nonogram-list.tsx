import { NonogramDifficultiesEnumType } from '@nonogram-api-monorepo/types';
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  useCreateGameMutation,
  useGetUnplayedNonogramsQuery,
  useGetAllAvaliableNonogramsQuery,
} from '../../../store/api';
import { RootState } from '../../../store/store';
import { DIFFICULTY_SIZE } from '../../../constants';
import { LoadingState, ErrorState } from '../../../components';
import { Separator } from '@nonogram-api-monorepo/ui';

type Props = {
  difficulty: NonogramDifficultiesEnumType | null;
  isDisplayAllNonograms: boolean;
};

export const NonogramList: React.FC<Props> = ({
  difficulty,
  isDisplayAllNonograms,
}) => {
  const userId = useSelector((state: RootState) => state.user.userId);
  const navigate = useNavigate();
  const [createGame] = useCreateGameMutation();

  const {
    data: allNonograms,
    isLoading: areAllNonogramsLoading,
    isError: isErrorInLoadingAllNonograms,
    error: allNonogramsLoadingError,
  } = useGetAllAvaliableNonogramsQuery(userId ?? '', { skip: !userId });

  const {
    data: unplayedNonograms,
    isLoading: areUnplayedNonogramsLoading,
    isError: isErrorLoadingUnplayedNonograms,
    error: unplayedNonogramsLoadingError,
  } = useGetUnplayedNonogramsQuery(userId ?? '', { skip: !userId });

  if (areAllNonogramsLoading || areUnplayedNonogramsLoading) {
    return <LoadingState />;
  }

  if (isErrorInLoadingAllNonograms) {
    return <ErrorState error={allNonogramsLoadingError} />;
  }
  if (isErrorLoadingUnplayedNonograms) {
    return <ErrorState error={unplayedNonogramsLoadingError} />;
  }

  if (!allNonograms || !unplayedNonograms) {
    return null;
  }

  const handleNonogramClick = async (nonogramId: string) => {
    const createdGameData = await createGame({
      nonogramId,
    }).unwrap();

    navigate(`/game/${createdGameData.id}`);
    return null;
  };

  const nonograms = isDisplayAllNonograms ? allNonograms : unplayedNonograms;

  const filteredNonograms = difficulty
    ? nonograms.filter((nonogram) => nonogram.difficulty === difficulty)
    : nonograms;

  return (
    <ul className="flex flex-col gap-2 overflow-y-scroll h-auto list-inside pb-2">
      {filteredNonograms && filteredNonograms.length > 0 ? (
        filteredNonograms.map(
          ({ id, name, likeCount, gameCount, difficulty, user }) => (
            <li
              key={id}
              className="cursor-pointer grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr] items-center shadow-md rounded-lg p-4 backdrop-blur-lg bg-absoluteWhite/30 text-sm md:text-lg"
              onClick={() => handleNonogramClick(id)}
            >
              <span className="font-bold text-center">{name}</span>
              <Separator orientation="vertical" className="w-full h-full" />
              <span className="font-semibold text-center">
                {user?.username}
              </span>
              <Separator orientation="vertical" className="w-full h-full" />
              <span className="text-center" role="img" aria-label="size emoji">
                📐 {DIFFICULTY_SIZE[difficulty]}
              </span>
              <Separator orientation="vertical" className="w-full h-full" />
              <span className="text-center" role="img" aria-label="like emoji">
                👍 {likeCount}
              </span>
              <Separator orientation="vertical" className="w-full h-full" />
              <span
                className="text-center"
                role="img"
                aria-label="joystick emoji"
              >
                🎮 {gameCount}
              </span>
            </li>
          )
        )
      ) : (
        <li className="text-center text-absoluteBlack/40 text-4xl">
          Nothing here yet...
        </li>
      )}
    </ul>
  );
};
