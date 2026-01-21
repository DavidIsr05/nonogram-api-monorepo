import { NotFoundException } from '@nestjs/common';

export class NonogramNotFoundException extends NotFoundException {
  constructor(nonogramId: number) {
    super(`Could not find a nonogram with id: ${nonogramId}`);
  }
}
