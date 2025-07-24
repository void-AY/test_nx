import {
  toCamelCase,
  toKebabCase,
  delay,
  isEmpty,
  deepClone,
} from './my-utils.js';

describe('MyUtils Utils', () => {
  describe('toCamelCase', () => {
    it('should convert kebab-case to camelCase', () => {
      expect(toCamelCase('hello-world')).toBe('helloWorld');
      expect(toCamelCase('my-awesome-function')).toBe('myAwesomeFunction');
    });

    it('should convert snake_case to camelCase', () => {
      expect(toCamelCase('hello_world')).toBe('helloWorld');
      expect(toCamelCase('my_awesome_function')).toBe('myAwesomeFunction');
    });

    it('should handle spaces', () => {
      expect(toCamelCase('hello world')).toBe('helloWorld');
      expect(toCamelCase('my awesome function')).toBe('myAwesomeFunction');
    });

    it('should handle already camelCase strings', () => {
      expect(toCamelCase('helloWorld')).toBe('helloWorld');
      expect(toCamelCase('myAwesomeFunction')).toBe('myAwesomeFunction');
    });
  });

  describe('toKebabCase', () => {
    it('should convert camelCase to kebab-case', () => {
      expect(toKebabCase('helloWorld')).toBe('hello-world');
      expect(toKebabCase('myAwesomeFunction')).toBe('my-awesome-function');
    });

    it('should convert PascalCase to kebab-case', () => {
      expect(toKebabCase('HelloWorld')).toBe('hello-world');
      expect(toKebabCase('MyAwesomeFunction')).toBe('my-awesome-function');
    });

    it('should handle snake_case', () => {
      expect(toKebabCase('hello_world')).toBe('hello-world');
      expect(toKebabCase('my_awesome_function')).toBe('my-awesome-function');
    });

    it('should handle spaces', () => {
      expect(toKebabCase('hello world')).toBe('hello-world');
      expect(toKebabCase('my awesome function')).toBe('my-awesome-function');
    });
  });

  describe('delay', () => {
    it('should delay execution', async () => {
      const start = Date.now();
      await delay(100);
      const end = Date.now();
      expect(end - start).toBeGreaterThanOrEqual(90); // Небольшая погрешность
    });

    it('should return a Promise', () => {
      const result = delay(10);
      expect(result).toBeInstanceOf(Promise);
    });
  });

  describe('isEmpty', () => {
    it('should return true for null and undefined', () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
    });

    it('should return true for empty string', () => {
      expect(isEmpty('')).toBe(true);
    });

    it('should return true for empty array', () => {
      expect(isEmpty([])).toBe(true);
    });

    it('should return true for empty object', () => {
      expect(isEmpty({})).toBe(true);
    });

    it('should return false for non-empty values', () => {
      expect(isEmpty('hello')).toBe(false);
      expect(isEmpty([1, 2, 3])).toBe(false);
      expect(isEmpty({ a: 1 })).toBe(false);
      expect(isEmpty(0)).toBe(false);
      expect(isEmpty(false)).toBe(false);
    });
  });

  describe('deepClone', () => {
    it('should clone primitive values', () => {
      expect(deepClone(42)).toBe(42);
      expect(deepClone('hello')).toBe('hello');
      expect(deepClone(true)).toBe(true);
      expect(deepClone(null)).toBe(null);
      expect(deepClone(undefined)).toBe(undefined);
    });

    it('should clone arrays', () => {
      const original = [1, 2, [3, 4]];
      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned[2]).not.toBe(original[2]);
    });

    it('should clone objects', () => {
      const original = {
        a: 1,
        b: {
          c: 2,
          d: [3, 4],
        },
      };
      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned.b).not.toBe(original.b);
      expect(cloned.b.d).not.toBe(original.b.d);
    });

    it('should clone dates', () => {
      const original = new Date('2023-01-01');
      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned).toBeInstanceOf(Date);
    });

    it('should handle circular references (shows limitation)', () => {
      const original: any = { a: 1 };
      original.self = original;
      
      // Этот тест демонстрирует ограничения простой реализации deepClone
      // В реальном проекте следует использовать более продвинутые решения
      expect(() => deepClone(original)).toThrow('Maximum call stack size exceeded');
    });
  });
});
