import { LocaleCode } from '#shared/enums/locale-code';
import { getLocaleCodeFromValue } from '#shared/enums/locale-code';

const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const locale = getLocaleCodeFromValue(String(query.locale)) ?? LocaleCode.UK;
  try {
    const response = await fetch(
      `http://${config.databaseApiHost}:${config.databaseApiPort}/api/educations-records?locale=${locale}`
    );
    const educationsRecords = await response.json();
    return educationsRecords as readonly EducationRecord[];
  } catch (error) {
    console.error('Error fetching education records:', error);
    return [] as readonly EducationRecord[];
  }
});
