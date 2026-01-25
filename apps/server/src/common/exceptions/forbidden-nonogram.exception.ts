import { ForbiddenException } from '@nestjs/common';

export class ForbiddenNonogramException extends ForbiddenException {
  constructor() {
    super('Can not access other users nonograms');
  }
}
