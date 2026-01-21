import { LocaleCode } from '#shared/enums/locale-code';
import { getLocaleCodeFromValue } from '#shared/enums/locale-code';

const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const locale = getLocaleCodeFromValue(String(query.locale)) ?? LocaleCode.UK;
  try {
    const response = await fetch(
      `http://${config.databaseApiHost}:${config.databaseApiPort}/api/employments-records?locale=${locale}`
    );
    const employmentsRecords = await response.json();
    return employmentsRecords as readonly EmploymentRecord[];
  } catch (error) {
    console.error('Error fetching employments records:', error);
    return [] as readonly EmploymentRecord[];
  }
});
