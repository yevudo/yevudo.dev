export enum LocaleCode {
  UK = 'uk',
  EN = 'en',
}

const isStringLocaleCode = (value: string | undefined): value is LocaleCode => {
  return (Object.values(LocaleCode) as string[]).includes(value ?? '');
};

export const getLocaleCodeFromValue = (
  value: string | undefined
): LocaleCode | undefined => {
  return isStringLocaleCode(value) ? value : undefined;
};
