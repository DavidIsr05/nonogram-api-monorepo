import { ConflictException } from '@nestjs/common';

export class UserAlreadyExistsException extends ConflictException {
  constructor(personalNumber: number) {
    super(`User with personal number: '${personalNumber}' already exists`);
  }
}
