export const INCLUDE_MECHANISMS = [
  '_spf.google.com',
  'spf.protection.outlook.com',
  'mail.zendesk.com',
  'amazonses.com',
];

export const MECHANISM_NAMES = {
  INCLUDE: 'include',
  IP4: 'ip4',
  IP6: 'ip6',
  A: 'a',
  MX: 'mx',
  EXISTS: 'exists',
};

export const MECHANISM_TYPES = Object.values(MECHANISM_NAMES);

export const POLICY_OPTIONS = {
  FAIL: 'Fail',
  SOFT_FAIL: 'SoftFail',
  NEUTRAL: 'Neutral',
};

export const PLACEHOLDERS = {
  DOMAIN: 'e.g. example.com',
  INCLUDE: 'Start typing Email Sender name or include value',
  A_RECORD: 'e.g. example2.com',
  REDIRECT: 'e.g _spf.google.com mail.zendesk.com',
};

export const REDIRECT_VALUES = [
  '_spf.google.com',
  'spf.protection.outlook.com',
  'mail.zendesk.com',
  'amazonses.com',
];

export const MECHANISM_VALUES = {
  A: 'easydmarc.com',
  MX: 'google.com',
  EXISTS: '%{i}._spf.mta.salesforce.com',
};

export const SPF_OUTPUT = {
  PREFIX: 'v=spf1',
  SOFT_FAIL_ALL: '~all',
  FAIL_ALL: '-all',
  REDIRECT: 'redirect=',
};