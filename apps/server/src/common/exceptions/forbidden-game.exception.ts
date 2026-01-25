import { ForbiddenException } from '@nestjs/common';

export class ForbiddenGameException extends ForbiddenException {
  constructor() {
    super('Can not access other users games');
  }
}
