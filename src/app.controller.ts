import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/time')
  getTime(): Date {
    return new Date();
  }
}
