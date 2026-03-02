import { BadRequestException } from '@nestjs/common';

export class LikingUnfinishedGameException extends BadRequestException {
  constructor() {
    super('can not like unfinished game');
  }
}
