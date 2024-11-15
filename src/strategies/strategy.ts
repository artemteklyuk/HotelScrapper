import { CheerioAPI, Cheerio } from 'cheerio';

export default interface HtmlExtractorStrategy {
  extractProperties(description: string, additionalDescription: string): Promise<any>;
}

export abstract class AbstractHtmlExtractStrategy {
  constructor() {}

  protected unwrapList(element: Cheerio<any>, $: CheerioAPI) {
    const items: string[] = [];

    element.each((_, element) => {
      items.push($(element).text().trim().replace(/\s+/g, ' '));
    });

    return items.length > 0 ? items : null;
  }

  protected dropAllAttributes($: CheerioAPI) {
    $('*').each(function () {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const attributes = this.attribs;
      for (const attr in attributes) {
        $(this).removeAttr(attr);
      }
    });
  }
}
