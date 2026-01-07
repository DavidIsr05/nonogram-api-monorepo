import { Controller } from '@nestjs/common';
import { NonogramService } from './nonogram.service';

@Controller('nonogram')
export class NonogramController {
  constructor(private nonogramService: NonogramService) {}
}
