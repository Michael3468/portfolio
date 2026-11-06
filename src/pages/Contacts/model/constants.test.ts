import { describe, expect, it } from 'vitest';

import {
  CONTACTS_LIST,
  CONTACTS_TITLE,
  EMAIL_ADDRESS,
  EMAIL_URL,
  LOCATION_TEXT,
  TELEGRAM_URL,
} from './constants';

/**
 * Набор тестов для констант страницы «Контакты».
 * Проверяет значения всех констант и структуру списка контактов.
 */
describe('Contacts model constants', () => {
  /**
   * Проверяет, что заголовок страницы «Контакты» задан корректно.
   */
  it('defines the contacts title', () => {
    expect(CONTACTS_TITLE).toBe('Contacts');
  });

  /**
   * Проверяет, что ссылка на Telegram задана корректно.
   */
  it('defines the telegram url', () => {
    expect(TELEGRAM_URL).toBe('https://t.me/mikhail3468');
  });

  /**
   * Проверяет, что адрес электронной почты задан корректно.
   */
  it('defines the email address', () => {
    expect(EMAIL_ADDRESS).toBe('mikhail3468@yandex.ru');
  });

  /**
   * Проверяет, что ссылка на Email задана корректно.
   */
  it('defines the email url', () => {
    expect(EMAIL_URL).toBe('mailto:mikhail3468@yandex.ru');
  });

  /**
   * Проверяет, что текст местоположения задан корректно.
   */
  it('defines the location text', () => {
    expect(LOCATION_TEXT).toBe('St. Petersburg, Russia');
  });

  /**
   * Проверяет, что список контактов содержит ожидаемые элементы
   * в корректном порядке: location, telegram, email.
   */
  it('builds the contacts list with expected items', () => {
    expect(CONTACTS_LIST).toHaveLength(3);

    expect(CONTACTS_LIST[0]).toEqual({
      id: 'location',
      title: 'Location',
      text: LOCATION_TEXT,
    });

    expect(CONTACTS_LIST[1]).toEqual({
      id: 'telegram',
      title: 'Telegram',
      link: {
        href: TELEGRAM_URL,
        label: TELEGRAM_URL,
      },
      withTextShadow: true,
    });

    expect(CONTACTS_LIST[2]).toEqual({
      id: 'email',
      title: 'Email',
      link: {
        href: EMAIL_URL,
        label: EMAIL_ADDRESS,
      },
      withTextShadow: true,
    });
  });
});
