import { BadRequestException } from '@nestjs/common';

export class NonogramLeadersException extends BadRequestException {
  constructor(error) {
    super('Could not get nonogram leaders', error.stack);
  }
}
