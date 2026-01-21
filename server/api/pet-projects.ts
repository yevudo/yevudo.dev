import { LocaleCode } from '#shared/enums/locale-code';
import { getLocaleCodeFromValue } from '#shared/enums/locale-code';

const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const locale = getLocaleCodeFromValue(String(query.locale)) ?? LocaleCode.UK;
  try {
    const response = await fetch(
      `http://${config.databaseApiHost}:${config.databaseApiPort}/api/pet-projects?locale=${locale}`
    );
    const petProjects = await response.json();
    return petProjects as readonly PetProject[];
  } catch (error) {
    console.error('Error fetching pet projects:', error);
    return [] as readonly PetProject[];
  }
});
