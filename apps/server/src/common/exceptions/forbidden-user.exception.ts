import { ForbiddenException } from '@nestjs/common';

export class ForbiddenUserException extends ForbiddenException {
  constructor() {
    super('Can not access other users data');
  }
}
