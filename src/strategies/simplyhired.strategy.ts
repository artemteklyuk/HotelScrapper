import HtmlExtractorStrategy, { AbstractHtmlExtractStrategy } from './strategy';
import { CheerioAPI, load } from 'cheerio';

export class SimplyhiredHtmlExtractorStrategy
  extends AbstractHtmlExtractStrategy
  implements HtmlExtractorStrategy
{
  extractProperties(
    description: string,
    additionalDescription?: string,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const $ = load(description, null, false);
        const descriptionApi = additionalDescription
          ? load(additionalDescription, null, false)
          : null;

        const benefits = this.extractBenefits($);
        const qualifications = this.extractQualifications($);
        const details = this.extractDetails($);

        let resultDescription: string | null = null;
        if (descriptionApi) {
          this.dropAllAttributes(descriptionApi);
          resultDescription = descriptionApi.html();
        }

        resolve({
          benefits,
          qualifications,
          salary: details ? details.salary : null,
          workingSchedule: details ? details.scheduleType : null,
          description: resultDescription,
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  private extractBenefits($: CheerioAPI) {
    const benefits = $('[data-testid="viewJobBenefitItem"]');
    if (benefits.length === 0) {
      return null;
    }

    return this.unwrapList(benefits, $);
  }

  private extractQualifications($: CheerioAPI) {
    try {
      const qualifications = $('[data-testid="viewJobQualificationItem"]');
      if (qualifications.length === 0) {
        return null;
      }

      return this.unwrapList(qualifications, $);
    } catch {
      return null;
    }
  }

  private extractDetails($: CheerioAPI) {
    const scheduleType = $('[data-testid="viewJobBodyJobDetailsJobType"]')
      .text()
      .trim();
    const salary = $('[data-testid="viewJobBodyJobCompensation"]')
      .text()
      .trim()
      .replace(/\s+/g, ' ');

    return {
      scheduleType: scheduleType.length > 0 ? scheduleType : null,
      salary: salary.length > 0 ? salary : null,
    };
  }
}
