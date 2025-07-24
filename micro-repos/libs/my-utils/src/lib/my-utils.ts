/**
 * Полезные утилиты для проекта
 * @packageDocumentation
 */

/**
 * Форматирует строку в camelCase
 * @param str - Входная строка
 * @returns Строка в формате camelCase
 * @example
 * ```typescript
 * toCamelCase('hello-world') // 'helloWorld'
 * toCamelCase('hello_world') // 'helloWorld'
 * ```
 */
export function toCamelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
    .replace(/^[A-Z]/, (char) => char.toLowerCase());
}

/**
 * Форматирует строку в kebab-case
 * @param str - Входная строка
 * @returns Строка в формате kebab-case
 * @example
 * ```typescript
 * toKebabCase('helloWorld') // 'hello-world'
 * toKebabCase('HelloWorld') // 'hello-world'
 * ```
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase();
}

/**
 * Создает задержку на указанное количество миллисекунд
 * @param ms - Количество миллисекунд
 * @returns Promise, который разрешается через указанное время
 * @example
 * ```typescript
 * await delay(1000); // Ждет 1 секунду
 * ```
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Проверяет, является ли значение пустым (null, undefined, пустая строка, пустой массив)
 * @param value - Значение для проверки
 * @returns true, если значение пустое
 * @example
 * ```typescript
 * isEmpty(null) // true
 * isEmpty('') // true
 * isEmpty([]) // true
 * isEmpty('hello') // false
 * ```
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Создает глубокую копию объекта
 * @param obj - Объект для копирования
 * @returns Глубокая копия объекта
 * @example
 * ```typescript
 * const original = { a: { b: 1 } };
 * const copy = deepClone(original);
 * copy.a.b = 2;
 * console.log(original.a.b); // 1
 * ```
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as T;
  if (obj instanceof Array) return obj.map((item) => deepClone(item)) as T;
  if (typeof obj === 'object') {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
}
