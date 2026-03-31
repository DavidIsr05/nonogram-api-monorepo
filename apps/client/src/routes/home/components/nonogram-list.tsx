import { NonogramDifficultiesEnumType } from '@nonogram-api-monorepo/types';
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  useCreateGameMutation,
  useGetUnplayedNonogramsQuery,
} from '../../../store/api';
import { RootState } from '../../../store/store';
import { DIFFICULTY_SIZE } from '../../../constants';
import { LoadingState, ErrorState } from '../../../components';

type Props = {
  difficulty: NonogramDifficultiesEnumType | null;
};

export const NonogramList: React.FC<Props> = ({ difficulty }) => {
  const userId = useSelector((state: RootState) => state.user.userId);
  const navigate = useNavigate();
  const [createGame] = useCreateGameMutation();

  const {
    data: nonograms,
    isLoading,
    isError,
    error,
  } = useGetUnplayedNonogramsQuery(userId ?? '', { skip: !userId });

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState error={error} />;
  }

  if (!nonograms) {
    return null;
  }

  const handleNonogramClick = async (nonogramId: string) => {
    const createdGameData = await createGame({
      nonogramId,
    }).unwrap();

    navigate(`/game/${createdGameData.id}`);
    return null;
  };

  const filteredNonograms = difficulty
    ? nonograms.filter((nonogram) => nonogram.difficulty === difficulty)
    : nonograms;

  return (
    <ul className="flex flex-col gap-2 overflow-scroll h-auto list-inside pb-2">
      {filteredNonograms && filteredNonograms.length > 0 ? (
        filteredNonograms.map(
          ({ id, name, likeCount, gameCount, difficulty, user }) => (
            <li
              key={id}
              className="cursor-pointer grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr] items-center shadow-md rounded-lg p-4 backdrop-blur-lg bg-absoluteWhite/30 text-sm md:text-lg"
              onClick={() => handleNonogramClick(id)}
            >
              <span className="font-bold text-center">{name}</span>
              <span className="text-dividorGray">|</span>
              <span className="font-semibold text-center">
                {user?.username}
              </span>
              <span className="text-dividorGray">|</span>
              <span className="text-center" role="img" aria-label="size emoji">
                📐 {DIFFICULTY_SIZE[difficulty]}
              </span>
              <span className="text-dividorGray">|</span>
              <span className="text-center" role="img" aria-label="like emoji">
                👍 {likeCount}
              </span>
              <span className="text-dividorGray">|</span>
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
