import { describe, expect, it } from 'vitest';

import { getLetters } from './lib';

/**
 * Набор тестов для функции `getLetters` страницы «Проекты».
 * Проверяет разбиение строки на массив отдельных символов.
 */
describe('getLetters (Projects)', () => {
  /**
   * Проверяет, что строка разбивается на массив букв.
   */
  it('splits a string into an array of letters', () => {
    expect(getLetters('Projects')).toEqual(['P', 'r', 'o', 'j', 'e', 'c', 't', 's']);
  });

  /**
   * Проверяет, что пробелы сохраняются как отдельные элементы массива.
   */
  it('keeps spaces as separate elements', () => {
    expect(getLetters('Test Tasks')).toEqual(['T', 'e', 's', 't', ' ', 'T', 'a', 's', 'k', 's']);
  });

  /**
   * Проверяет, что пустая строка возвращает пустой массив.
   */
  it('returns an empty array for an empty string', () => {
    expect(getLetters('')).toEqual([]);
  });
});
