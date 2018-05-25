import {
  validateRequired,
  validateMinTwoChars,
  validateAtLeastRequired,
  validateURL,
  validateLinkReturnAsSkosType,
  validateEmail,
  validatePhone
} from '../../src/validation/validation';

it('should run validateRequired correctly', () => {
  expect(validateRequired('nameOfObject', null, [])).not.toBeNull();
  expect(validateRequired('nameOfObject', 'value', [])).toEqual([]);
});

it('should run validateMinTwoChars correctly', () => {
  expect(validateMinTwoChars('nameOfObject', 'v', [])).not.toBeNull();
  expect(validateMinTwoChars('nameOfObject', null, [])).toEqual([]);
});

it('should run validateAtLeastRequired correctly', () => {
  expect(validateAtLeastRequired('nameOfObject', 'va', 3, [])).not.toBeNull();
  expect(validateAtLeastRequired('nameOfObject', 'valu', 3, [])).toEqual([]);
});

it('should run validateURL correctly', () => {
  expect(validateURL('nameOfObject', 'http', [], false)).not.toBeNull();
  expect(validateURL('nameOfObject', 'http', [], true)).not.toBeNull();
  expect(validateURL('nameOfObject', 'http://www.google.com', [])).toEqual([]);
});

it('should run validateLinkReturnAsSkosType correctly', () => {
  expect(
    validateLinkReturnAsSkosType('nameOfObject', { nb: 'http' }, [], false)
  ).not.toBeNull();
  expect(
    validateLinkReturnAsSkosType('nameOfObject', { nb: 'http' }, [], true)
  ).not.toBeNull();
  expect(
    validateLinkReturnAsSkosType('nameOfObject', 'http://www.google.com', [])
  ).toEqual([]);
});

it('should run validateEmail correctly', () => {
  expect(validateEmail('nameOfObject', 'fellesdatakatalog', [])).not.toBeNull();
  expect(
    validateEmail('nameOfObject', 'fellesdatakatalog@brreg.no', [])
  ).toEqual([]);
});

it('should run validatePhone correctly', () => {
  expect(validatePhone('nameOfObject', '1', [])).not.toBeNull();
  expect(validatePhone('nameOfObject', '1234567', [])).not.toBeNull();
  expect(validatePhone('nameOfObject', '12345678', [])).toEqual([]);
  expect(validatePhone('nameOfObject', '+4712345678', [])).toEqual([]);
  expect(validatePhone('nameOfObject', '12345', [])).toEqual([]);
});
