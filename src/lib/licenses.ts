// Note: license is spelled 'license' in code, per convention that code is written in American English,
// but 'licence' in the UI per Canadian English. 'License' is a verb that always has the 's' in both
// Canadian and American English, but 'licence' is a noun spelled with a 'c' in Canadian English.

export type LicenseNumberFormat = {
  regex: RegExp;
  placeholder: string;
  hint: string;
};

export const licenseNumberFormats: { [key: string]: LicenseNumberFormat } = {
  "CA-AB": {
    regex: /^(\d{6})-?(\d{3})$/,
    placeholder: "111111-111",
    hint: "9 digits",
  },
  "CA-BC": {
    regex: /^(\d{7}\d?)$/,
    placeholder: "11111111",
    hint: "7 or 8 digits",
  },
  "CA-ON": {
    regex: /^([A-Z]\d{4})-?(\d{5})-?(\d{5})$/,
    placeholder: "A1111-11111-11111",
    hint: "1 letter and 14 digits",
  },
  "CA-QC": {
    regex: /^([A-Z]\d{4})-?(\d{6})-?(\d{2})$/,
    placeholder: "A1111-111111-11",
    hint: "1 letter and 12 digits",
  },
};
