import { CreateSearchString } from '../types/createSearchString.type';

export const createSearchString = (
  createSearchStringData: CreateSearchString,
) => {
  const [baseUrl, filtersString] =
    createSearchStringData.baseSearchString.split('?');
  const filtersObject = {};

  filtersString.split('&').forEach((item) => {
    const [key, value] = item.split('=');

    if (key === 'check_in') {
      filtersObject[key] = createSearchStringData.fromDate;
      return;
    }
    if (key === 'check_out') {
      filtersObject[key] = createSearchStringData.toDate;
      return;
    }
    if (key === 'room[0]') {
      filtersObject[key] =
        `${createSearchStringData.adultsCount}.${createSearchStringData.childrenAge.join('-')}`;
      return;
    }
    filtersObject[key] = value;
  });

  const newSearchString = `${baseUrl}?${Object.entries(filtersObject)
    .map((item) => item.join('='))
    .join('&')}`;
  return newSearchString;
};
