export type Country = {
  code: string;
  dialCode: string;
  flag: string;
  name: string;
};

export const COUNTRIES: Country[] = [
  { code: 'BW', dialCode: '+267', flag: '🇧🇼', name: 'Botswana' },
  { code: 'KE', dialCode: '+254', flag: '🇰🇪', name: 'Kenya' },
  { code: 'ZA', dialCode: '+27',  flag: '🇿🇦', name: 'South Africa' },
  { code: 'GH', dialCode: '+233', flag: '🇬🇭', name: 'Ghana' },
];

export const DEFAULT_COUNTRY = COUNTRIES[0];
