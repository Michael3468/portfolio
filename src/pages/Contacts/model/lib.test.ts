import { describe, expect, it } from 'vitest';

import { getLetters, replaceSpaceWithNbsp } from './lib';

/**
 * Набор тестов для функции `getLetters` страницы «Контакты».
 * Проверяет разбиение строки на массив отдельных символов.
 */
describe('getLetters (Contacts)', () => {
  /**
   * Проверяет, что строка разбивается на массив букв.
   */
  it('splits a string into an array of letters', () => {
    expect(getLetters('Contacts')).toEqual(['C', 'o', 'n', 't', 'a', 'c', 't', 's']);
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

describe('replaceSpaceWithNbsp (Contacts)', () => {
  /**
   * Проверяет, что обычный пробел заменяется неразрывным (nbsp).
   */
  it('replaces a regular space with a non-breaking space', () => {
    expect(replaceSpaceWithNbsp(' ')).toBe('\u00A0');
  });

  /**
   * Проверяет, что обычные символы остаются без изменений.
   */
  it('leaves non-space characters unchanged', () => {
    expect(replaceSpaceWithNbsp('C')).toBe('C');
  });
});
