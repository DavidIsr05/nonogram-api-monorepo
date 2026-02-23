import { NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor(error, personalNumber?: number, id?: string) {
    if (personalNumber) {
      super(
        `Could not find a user with personal number: ${personalNumber}`,
        error
      );
    } else {
      super(`Could not find a user with id: ${id}`, error);
    }
  }
}
