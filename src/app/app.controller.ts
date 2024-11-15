import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get('start')
  public async startScrapping() {
    // await this.appService.startScraping();
    await this.appService.testCheerio();
  }
}
