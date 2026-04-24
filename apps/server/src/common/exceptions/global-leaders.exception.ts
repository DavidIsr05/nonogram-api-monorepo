import { BadRequestException } from '@nestjs/common';

export class GlobalLeadersException extends BadRequestException {
  constructor(error) {
    super('Could not get global leaderboard', error.stack);
  }
}
