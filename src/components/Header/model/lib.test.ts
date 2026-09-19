import { describe, expect, it } from 'vitest';

import { getLetters } from './lib';

/**
 * Набор тестов для функции `getLetters` из шапки сайта.
 * Проверяет разбиение строки на массив отдельных символов.
 */
describe('getLetters (Header)', () => {
  /**
   * Проверяет, что строка разбивается на массив букв.
   */
  it('splits a string into an array of letters', () => {
    expect(getLetters('Hi')).toEqual(['H', 'i']);
  });

  /**
   * Проверяет, что пробелы сохраняются как отдельные элементы массива.
   */
  it('keeps spaces as separate elements', () => {
    expect(getLetters('a b')).toEqual(['a', ' ', 'b']);
  });

  /**
   * Проверяет, что пустая строка возвращает пустой массив.
   */
  it('returns an empty array for an empty string', () => {
    expect(getLetters('')).toEqual([]);
  });
});
