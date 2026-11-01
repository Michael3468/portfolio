import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useLocalStorage } from './useLocalStorage';

/**
 * Пропсы вспомогательного компонента StorageHarness, используемого в тестах хука.
 */
interface StorageHarnessProps {
  readonly storageKey: string;
  readonly defaultValue: number;
}

/**
 * Вспомогательный компонент, оборачивающий хук `useLocalStorage` и позволяющий
 * проверить его поведение: отображает текущее значение и кнопку для его обновления.
 *
 * @param props - пропсы компонента.
 * @param props.storageKey - ключ, по которому значение хранится в localStorage.
 * @param props.defaultValue - значение по умолчанию, если ключ отсутствует в хранилище.
 */
function StorageHarness({ storageKey, defaultValue }: StorageHarnessProps) {
  const [value, setValue] = useLocalStorage<number>(storageKey, defaultValue);

  return (
    <div>
      <span data-testid="value">{String(value)}</span>
      <button type="button" onClick={() => setValue(42)}>
        update
      </button>
    </div>
  );
}

/**
 * Вспомогательный компонент для тестирования строковых значений хранилища.
 */
interface StringStorageHarnessProps {
  readonly storageKey: string;
  readonly defaultValue: string;
}

/**
 * Вспомогательный компонент, оборачивающий хук `useLocalStorage`
 * для строковых значений и позволяющий проверить их сохранение.
 */
function StringStorageHarness({ storageKey, defaultValue }: StringStorageHarnessProps) {
  const [value, setValue] = useLocalStorage<string>(storageKey, defaultValue);

  return (
    <div>
      <span data-testid="value">{value}</span>
      <button type="button" onClick={() => setValue('updated-value')}>
        update
      </button>
    </div>
  );
}

/**
 * Набор тестов для хука `useLocalStorage`.
 */
describe('useLocalStorage', () => {
  /**
   * Очищает localStorage перед каждым тестом, чтобы изолировать сценарии друг от друга.
   */
  beforeEach(() => {
    localStorage.clear();
  });

  /**
   * Проверяет, что хук возвращает значение по умолчанию,
   * когда в localStorage нет данных по указанному ключу.
   */
  it('returns the default value when storage is empty', () => {
    render(<StorageHarness storageKey="counter" defaultValue={0} />);

    expect(screen.getByTestId('value')).toHaveTextContent('0');
  });

  /**
   * Проверяет, что хук читает уже сохранённое значение из localStorage
   * и использует его вместо значения по умолчанию.
   */
  it('reads an existing value from localStorage', () => {
    localStorage.setItem('counter', JSON.stringify(7));

    render(<StorageHarness storageKey="counter" defaultValue={0} />);

    expect(screen.getByTestId('value')).toHaveTextContent('7');
  });

  /**
   * Проверяет, что при обновлении состояния хук сохраняет новое значение
   * в localStorage в сериализованном виде (через JSON.stringify).
   */
  it('persists a new value to localStorage on update', () => {
    render(<StorageHarness storageKey="counter" defaultValue={0} />);

    fireEvent.click(screen.getByRole('button', { name: 'update' }));

    expect(screen.getByTestId('value')).toHaveTextContent('42');
    expect(localStorage.getItem('counter')).toBe('42');
  });

  /**
   * Проверяет, что хук не падает и возвращает значение по умолчанию,
   * когда в localStorage для нестрокового значения лежит некорректный JSON.
   */
  it('returns the default value when a non-string value has invalid JSON', () => {
    localStorage.setItem('counter', '{not-valid-json');

    render(<StorageHarness storageKey="counter" defaultValue={0} />);

    expect(screen.getByTestId('value')).toHaveTextContent('0');
  });

  /**
   * Проверяет, что при недоступном localStorage хук возвращает значение по умолчанию
   * и не падает при обновлении.
   */
  it('keeps working in memory when localStorage throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('denied', 'SecurityError');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('quota', 'QuotaExceededError');
    });

    render(<StorageHarness storageKey="counter" defaultValue={0} />);
    expect(screen.getByTestId('value')).toHaveTextContent('0');

    fireEvent.click(screen.getByRole('button', { name: 'update' }));
    expect(screen.getByTestId('value')).toHaveTextContent('42');

    vi.restoreAllMocks();
  });

  /**
   * Проверяет, что для строковых значений хук сохраняет значение
   * в localStorage «как есть», без JSON-сериализации.
   */
  it('stores string values without JSON serialization', () => {
    localStorage.setItem('stringKey', 'hello');

    render(<StringStorageHarness storageKey="stringKey" defaultValue="world" />);

    expect(screen.getByTestId('value')).toHaveTextContent('hello');

    fireEvent.click(screen.getByRole('button', { name: 'update' }));

    expect(screen.getByTestId('value')).toHaveTextContent('updated-value');
    expect(localStorage.getItem('stringKey')).toBe('updated-value');
  });
});
