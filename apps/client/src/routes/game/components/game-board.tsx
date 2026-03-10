import { GameWithCluesResponseType } from '@nonogram-api-monorepo/types';
import React from 'react';

type Props = GameWithCluesResponseType;

export const GameBoard: React.FC<Props> = ({
  rowClues,
  colClues,
  uncompletedNonogram,
  timer,
  mistakes,
  hints,
}) => {
  return <span>yo</span>;
};
