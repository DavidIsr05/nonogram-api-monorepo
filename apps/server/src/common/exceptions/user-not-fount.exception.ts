import { NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor(personalNumber?: number, id?: string) {
    if (personalNumber) {
      super(`Could not find a user with personal number: ${personalNumber}`);
    } else {
      super(`Could not find a user with id: ${id}`);
    }
  }
}
