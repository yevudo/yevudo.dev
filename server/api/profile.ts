import { LocaleCode } from '#shared/enums/locale-code';
import { getLocaleCodeFromValue } from '#shared/enums/locale-code';

const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const locale = getLocaleCodeFromValue(String(query.locale)) ?? LocaleCode.UK;
  try {
    const response = await fetch(
      `http://${config.databaseApiHost}:${config.databaseApiPort}/api/profile?locale=${locale}`
    );
    const profile = await response.json();
    return profile as Profile;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
});
