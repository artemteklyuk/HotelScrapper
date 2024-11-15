import HtmlExtractorStrategy, { AbstractHtmlExtractStrategy } from './strategy';
import { load } from 'cheerio';

export class TalentHtmlExtractStrategy extends AbstractHtmlExtractStrategy implements HtmlExtractorStrategy {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  extractProperties(description: string, additionalDescription: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      try {
        const $ = load(description, null, false);
        this.dropAllAttributes($);

        // Временное решение, пока что достаем только
        // описание, потом как будет больше времени -
        // надо будет подумать как вытаскивать инфу
        // по ключевым словам, потому как сейчас структура
        // описания состоит исключительно из тегов
        // <p> <ul> <li> без каких либо атрибутов
        resolve({
          salary: null,
          benefits: null,
          workingSchedule: null,
          qualifications: null,
          description: $.html(),
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}
