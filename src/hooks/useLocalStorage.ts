import { Dispatch, SetStateAction, useEffect, useState } from 'react';

/**
 * Читает значение из localStorage и возвращает его либо значение по умолчанию.
 *
 * @template T - тип хранимого значения.
 * @param key - ключ в localStorage.
 * @param defaultValue - значение, возвращаемое при отсутствии данных по ключу.
 * @returns сохранённое значение либо defaultValue.
 */
const getStorageValue = <T>(key: string, defaultValue: T): T => {
  const savedData = localStorage.getItem(key);
  return savedData ? (savedData as T) : defaultValue;
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
  const [value, setValue] = useState(() => getStorageValue<T>(key, defaultValue));

  useEffect(() => {
    if (typeof value === 'string') {
      localStorage.setItem(key, value);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value]);

  return [value, setValue];
};
