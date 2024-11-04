import { Injectable, OnModuleInit } from '@nestjs/common';
import { error } from 'console';
import * as playwright from 'playwright';
import { BASE_URL } from 'src/core/consts/tuturu-consts';

@Injectable()
export class AppService implements OnModuleInit {
  onModuleInit = async () => {
    try {
      const browser = await playwright.chromium.launch({ headless: true });
      const context = await browser.newContext();
      const page = await context.newPage();

      await page.setDefaultTimeout(3000);
      await page.setViewportSize({ width: 800, height: 600 });
      await page.goto(BASE_URL);

      await browser.close();
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
}
