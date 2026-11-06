import { describe, expect, it } from 'vitest';

import { CONTACTS_LIST } from './model/constants';

/**
 * Тесты типов из `src/pages/Contacts/Contacts.types.ts`.
 * Проверяет, что данные контактов соответствуют интерфейсам ContactLink и ContactItem.
 */
describe('ContactLink type contract', () => {
  /**
   * Проверяет, что все контакты имеют href и label.
   */
  it('every contact item has href and label', () => {
    for (const contact of CONTACTS_LIST) {
      if (contact.link) {
        expect(typeof contact.link.href).toBe('string');
        expect(contact.link.href.length).toBeGreaterThan(0);
        expect(typeof contact.link.label).toBe('string');
        expect(contact.link.label.length).toBeGreaterThan(0);
      }
    }
  });

  /**
   * Проверяет, что label (видимый текст ссылки) задан строкой.
   */
  it('label is a non-empty string when present', () => {
    for (const contact of CONTACTS_LIST) {
      if (contact.link) {
        expect(typeof contact.link.label).toBe('string');
        expect(contact.link.label.length).toBeGreaterThan(0);
      }
    }
  });
});

describe('ContactItem type contract', () => {
  /**
   * Проверяет, что каждый элемент имеет id и title.
   */
  it('every contact has id and title', () => {
    for (const contact of CONTACTS_LIST) {
      expect(typeof contact.id).toBe('string');
      expect(contact.id.length).toBeGreaterThan(0);
      expect(typeof contact.title).toBe('string');
      expect(contact.title.length).toBeGreaterThan(0);
    }
  });

  /**
   * Проверяет, что каждый элемент содержит либо text, либо link.
   */
  it('has either text or link', () => {
    for (const contact of CONTACTS_LIST) {
      const hasText = typeof contact.text === 'string' && contact.text.length > 0;
      const hasLink = contact.link !== undefined;
      expect(hasText || hasLink).toBe(true);
    }
  });

  /**
   * Проверяет, что withTextShadow (если указан) имеет тип boolean.
   */
  it('withTextShadow is boolean when present', () => {
    for (const contact of CONTACTS_LIST) {
      if (contact.withTextShadow !== undefined) {
        expect(typeof contact.withTextShadow).toBe('boolean');
      }
    }
  });
});
