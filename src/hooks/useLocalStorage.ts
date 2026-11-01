import { Dispatch, SetStateAction, useEffect, useState } from 'react';

/**
 * Читает значение из localStorage и возвращает его либо значение по умолчанию.
 *
 * Строковое значение по умолчанию означает, что в хранилище лежит строка «как есть».
 * Для остальных типов значение парсится из JSON. Если localStorage недоступен
 * (приватный режим, запрет доступа) или JSON повреждён, возвращается значение по умолчанию.
 *
 * @template T - тип хранимого значения.
 * @param key - ключ в localStorage.
 * @param defaultValue - значение, возвращаемое при отсутствии или ошибке чтения.
 * @returns сохранённое значение либо defaultValue.
 */
const readStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) {
      return defaultValue;
    }
    if (typeof defaultValue === 'string') {
      return raw as T;
    }
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
};

/**
 * Сохраняет значение в localStorage. Строки пишутся как есть, остальные типы — через JSON.stringify.
 * Ошибки записи (переполнение квоты, недоступное хранилище) игнорируются: состояние остаётся
 * в памяти компонента, просто не переживёт перезагрузку страницы.
 *
 * @template T - тип сохраняемого значения.
 * @param key - ключ в localStorage.
 * @param value - значение для сохранения.
 */
const writeStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  } catch {
    // localStorage недоступен или заполнен — продолжаем работу без сохранения
  }
};

/**
 * Хук синхронизирует состояние компонента с localStorage:
 * при изменении значения оно автоматически сохраняется в localStorage по указанному ключу.
 * Строки сохраняются как есть, остальные типы — через JSON.stringify.
 *
 * @template T - тип сохраняемого значения.
 * @param key - ключ, по которому значение хранится в localStorage.
 * @param defaultValue - начальное значение, используемое при отсутствии данных по ключу.
 * @returns кортеж из текущего значения и функции его обновления (аналог useState).
 *
 * @example
 * // определение переключаемой переменной darkMode на сайте:
 * type DarkMode = 'light' | 'dark';
 * const [darkMode, setDarkMode] = useLocalStorage<DarkMode>('darkMode', 'light');
 */
export const useLocalStorage = <T>(
  key: string,
  defaultValue: T,
): [T, Dispatch<SetStateAction<T>>] => {
  const [value, setValue] = useState(() => readStorage<T>(key, defaultValue));

  useEffect(() => {
    writeStorage(key, value);
  }, [key, value]);

  return [value, setValue];
};
