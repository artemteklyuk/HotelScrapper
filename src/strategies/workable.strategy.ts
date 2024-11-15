import { CheerioAPI, load } from 'cheerio';
import HtmlExtractorStrategy, { AbstractHtmlExtractStrategy } from './strategy';

export class WorkableHtmlExtractorStrategy extends AbstractHtmlExtractStrategy implements HtmlExtractorStrategy {
  public extractProperties(description: string, additionalDescription?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const $ = load(description.concat(additionalDescription || ''), null, false);

        const benefits = this.extractBenefits($);
        const qualifications = this.extractQualifications($);

        let resultDescription: string | null = null;
        if (additionalDescription) {
          const additionalDescriptionApi = load(additionalDescription, null, false);
          this.dropAllAttributes(additionalDescriptionApi);

          resultDescription = additionalDescriptionApi.html();
        }

        resolve({
          benefits,
          qualifications,
          salary: null,
          workingSchedule: null,
          description: resultDescription,
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  private extractBenefits($: CheerioAPI) {
    const benefitsBlock = $('div[data-ui="job-breakdown-benefits-parsed-html"]');
    const items = benefitsBlock.find('li');

    return this.unwrapList(items, $);
  }

  private extractQualifications($: CheerioAPI) {
    const qualificationsBlock = $('div[data-ui="job-breakdown-requirements-parsed-html"]');
    const items = qualificationsBlock.find('li');

    return this.unwrapList(items, $);
  }
}
