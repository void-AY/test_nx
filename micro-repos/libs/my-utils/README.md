# MyUtils

Полезные утилиты для проекта

## Установка

```bash
# Если это внутренняя библиотека в монорепозитории
nx build my-utils
```

## Использование

### Форматирование строк

```typescript
import { toCamelCase, toKebabCase } from 'my-utils';

// Конвертация в camelCase
const camelCase = toCamelCase('hello-world'); // 'helloWorld'
const camelCase2 = toCamelCase('hello_world'); // 'helloWorld'

// Конвертация в kebab-case
const kebabCase = toKebabCase('helloWorld'); // 'hello-world'
const kebabCase2 = toKebabCase('HelloWorld'); // 'hello-world'
```

### Асинхронные утилиты

```typescript
import { delay } from 'my-utils';

// Создание задержки
async function example() {
  console.log('Начало');
  await delay(1000); // Ждет 1 секунду
  console.log('Конец');
}
```

### Проверки и валидация

```typescript
import { isEmpty } from 'my-utils';

// Проверка на пустоту
console.log(isEmpty(null)); // true
console.log(isEmpty('')); // true
console.log(isEmpty([])); // true
console.log(isEmpty({})); // true
console.log(isEmpty('hello')); // false
```

### Работа с объектами

```typescript
import { deepClone } from 'my-utils';

// Глубокое клонирование
const original = {
  user: {
    name: 'John',
    preferences: ['dark-theme', 'notifications'],
  },
};

const copy = deepClone(original);
copy.user.name = 'Jane';

console.log(original.user.name); // 'John' (оригинал не изменился)
console.log(copy.user.name); // 'Jane'
```

## API Reference

### `toCamelCase(str: string): string`

Конвертирует строку в формат camelCase.

**Параметры:**

- `str` - Входная строка

**Возвращает:** Строка в формате camelCase

### `toKebabCase(str: string): string`

Конвертирует строку в формат kebab-case.

**Параметры:**

- `str` - Входная строка

**Возвращает:** Строка в формате kebab-case

### `delay(ms: number): Promise<void>`

Создает задержку на указанное количество миллисекунд.

**Параметры:**

- `ms` - Количество миллисекунд

**Возвращает:** Promise, который разрешается через указанное время

### `isEmpty(value: unknown): boolean`

Проверяет, является ли значение пустым.

**Параметры:**

- `value` - Значение для проверки

**Возвращает:** `true`, если значение пустое

### `deepClone<T>(obj: T): T`

Создает глубокую копию объекта.

**Параметры:**

- `obj` - Объект для копирования

**Возвращает:** Глубокая копия объекта

## Разработка

```bash
# Запуск тестов
nx test my-utils

# Сборка библиотеки
nx build my-utils

# Линтинг
nx lint my-utils
```

## Лицензия

MIT
