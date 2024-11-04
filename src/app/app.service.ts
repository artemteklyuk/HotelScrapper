import { Injectable, OnModuleInit } from '@nestjs/common';
import * as playwright from 'playwright';
import * as random_useragent from 'random-useragent';
import { setTimeout as wait } from 'node:timers/promises';

import { BASE_URL } from 'src/core/consts/tuturu-consts';
import { createSearchString } from 'src/core/helpers/createSearchString';

@Injectable()
export class AppService {
  private fromDate = '2024-11-04';
  private toDate = '2024-11-10';

  public startScraping = async () => {
    try {
      const browser = await playwright.chromium.launch({ headless: true });
      const context = await browser.newContext();

      // const page = await context.newPage();
      // await page.setDefaultTimeout(100000);
      // const preparedUrl = await this.createUrlForScrapping(page);

      const newPage = await context.newPage();
      await newPage.setDefaultTimeout(100000);

      const urlFromScrapping = createSearchString({
        adultsCount: 4,
        baseSearchString:
          'https://hotel.tutu.ru/offers?check_in=2024-11-04&check_out=2024-12-02&details_params=&filters[0]=optionFiltersList.rating.rating_more_zero&filters[1]=optionFiltersList.distance_to_center.distance_to_center_any_distance&geo_id=2656915&geo_name=Санкт-Петербург&geo_type=locality&room[0]=2.&search_id=5775309d-aa0e-4ea7-86e9-fcf0b4fcfd0e&sorting=relevanceDesc',
        childrenAge: [12, 11, 10],
        fromDate: this.fromDate,
        toDate: this.toDate,
      });
      await newPage.setDefaultTimeout(100000);

      await newPage.goto(urlFromScrapping, { waitUntil: 'load' });
      await wait(2000);

      await this.scrollPage(newPage);

      await await browser.close();

      process.exit(1);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };

  private createUrlForScrapping = async (
    page: playwright.Page,
  ): Promise<string> => {
    await page.goto(BASE_URL);

    const pageInput = await page.$('[data-ti=hotels-destination-input]');
    await pageInput.fill('Москва');

    await wait(2000);
    await page.screenshot({ path: './screenshots/fillPlace.png' });

    const dataArea = await page.$('[data-ti=date-input]');
    await dataArea.click({
      clickCount: 2,
      delay: 500,
    });

    await wait(2000);
    await page.screenshot({ path: './screenshots/clickDataInput.png' });

    const dateInput = await page.$$('div[aria-disabled="false"].DayPicker-Day');
    await dateInput[0].click({ delay: 1500 });
    await dateInput[1].click({ delay: 1500 });

    await page.screenshot({ path: './screenshots/fillDataInput.png' });

    const button = await page.$('button.order-group-element.o-button-wrapper');
    await button.click();

    await wait(2000);
    await page.screenshot({ path: './screenshots/loading.png' });

    const url = await page.url();

    await page.close();

    return url;
  };

  private scraper = async (page: playwright.Page) => {
    const cards = await page.$$('[data-ti=offer-card]');
    console.log(cards.length);
    // for (const product of products) {
    //   const name = await product.$eval(
    //     '.product-name',
    //     (element) => element.innerText,
    //   );
    //   const price = await product.$eval(
    //     '.product-price',
    //     (element) => element.innerText,
    //   );

    //   console.log(`Name: ${name}`);
    //   console.log(`Price: ${price}`);
    // }
  };

  private scrollPage = async (page: playwright.Page) => {
    const countSpan = await page.$(
      'span.o-text-inline.o-text-secondary.o-text-paragraphSmall',
    );
    const cardCount = Number(
      (await countSpan.innerText()).split(String.fromCharCode(160))[0],
    );
    // ВЗЯЛ КОЛИЧЕСТВО ВСЕХ КАРТОЧЕК
    while (true) {
      const cards = await page.$$('[data-ti=offer-card]');

      await page.screenshot({ path: './screenshots/beforeScroll.png' });
      // await lastCard.scrollIntoViewIfNeeded({ timeout: 1000 });

      await wait(3000);
      await page.screenshot({ path: './screenshots/afterScroll.png' });
    }
  };
}
