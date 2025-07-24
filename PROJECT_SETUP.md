# Создание Nx Workspace с Микро-Репозиториями

Эта документация описывает пошаговый процесс создания нового Nx workspace с поддержкой микро-репозиториев и кастомных генераторов.

## Предварительные требования

- Node.js (версия 18 или выше)
- npm или yarn
- Git
- Nx CLI (`npm install -g nx`)

## Шаг 1: Создание Nx workspace

```bash
# Создать новый Nx workspace
npx create-nx-workspace@latest <название-workspace> --preset=empty

# Перейти в папку проекта
cd <название-workspace>
```

## Шаг 2: Установка зависимостей

```bash
# Установить необходимые плагины
npm install --save-dev @nx/react @nx/vite @nx/cypress @nx/eslint

# Или с yarn
yarn add --dev @nx/react @nx/vite @nx/cypress @nx/eslint
```

## Шаг 3: Создание структуры проекта

```bash
# Создать основные папки (опционально)
mkdir -p micro-repos/apps
mkdir -p micro-repos/libs
mkdir -p micro-repos/e2e

# Или используйте любую другую структуру директорий
```

## Шаг 4: Использование встроенных генераторов Nx

Nx предоставляет набор встроенных генераторов, которые можно использовать для быстрого создания приложений и библиотек. Эти генераторы доступны через плагины Nx и могут быть использованы до создания собственных генераторов.

### Основные встроенные генераторы

#### Создание React приложения
```bash
nx generate @nx/react:app <название-приложения> --directory=micro-repos/apps/<название-приложения>
```

#### Создание React библиотеки
```bash
nx generate @nx/react:lib <название-библиотеки> --directory=micro-repos/libs/<название-библиотеки>
```

#### Создание компонента
```bash
nx generate @nx/react:component <название-компонента> --project=<название-проекта>
```

#### Создание Next.js приложения
```bash
nx generate @nx/next:app <название-приложения> --directory=micro-repos/apps/<название-приложения>
```

#### Создание Node.js приложения
```bash
nx generate @nx/node:app <название-приложения> --directory=micro-repos/apps/<название-приложения>
```

#### Создание Express приложения
```bash
nx generate @nx/express:app <название-приложения> --directory=micro-repos/apps/<название-приложения>
```

### Примеры использования

```bash
# Создать React приложение
nx generate @nx/react:app main-app --directory=micro-repos/apps/main-app --routing=true --style=scss

# Создать библиотеку компонентов
nx generate @nx/react:lib ui-components --directory=micro-repos/libs/ui-components --buildable

# Создать утилитарную библиотеку
nx generate @nx/js:lib utils --directory=micro-repos/libs/utils
```

### Опции генераторов

Каждый генератор имеет свой набор опций. Чтобы увидеть все доступные опции, используйте команду:

```bash
nx generate @nx/<плагин>:<генератор> --help

# Например:
nx generate @nx/react:app --help
```

## Шаг 5: Создание собственных workspace генераторов

```bash
# Создать первый генератор через команду Nx
nx generate @nx/plugin:generator <название-генератора> --directory=workspace-generators/src/generators/<название-генератора>

# Например:
nx generate @nx/plugin:generator counter-app --directory=workspace-generators/src/generators/counter-app
```

### Создание функции генератора

После создания базовой структуры, создайте файл генератора (например, `counter-app.ts`):

```typescript
import { 
  Tree, 
  formatFiles, 
  installPackagesTask, 
  generateFiles, 
  joinPathFragments, 
} from '@nx/devkit'; 
import { applicationGenerator } from '@nx/react'; 

interface Schema { 
  name: string; 
  title?: string; 
} 

export default async function (tree: Tree, options: Schema) { 
  // Создаем базовое React приложение 
  await applicationGenerator(tree, { 
    name: options.name, 
    style: 'scss', 
    bundler: 'vite', 
    unitTestRunner: 'vitest', 
    e2eTestRunner: 'playwright', 
  }); 

  // Генерируем файлы из шаблонов 
  generateFiles( 
    tree, 
    joinPathFragments(__dirname, 'files'), 
    `${options.name}/src/app`, 
    { 
      ...options, 
      title: options.title || 'Счетчик', 
      tmpl: '', 
    } 
  ); 

  await formatFiles(tree); 
  return () => { 
    installPackagesTask(tree); 
  }; 
}
```

### Создание схемы генератора

Создайте файл `schema.json` для определения параметров генератора:

```json
{
  "$schema": "http://json-schema.org/schema",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Название приложения",
      "$default": {
        "$source": "argv",
        "index": 0
      },
      "x-prompt": "Как назвать приложение?"
    },
    "title": {
      "type": "string",
      "description": "Заголовок приложения",
      "x-prompt": "Заголовок приложения (необязательно):"
    }
  },
  "required": ["name"]
}
```

### Регистрация генератора

Добавьте генератор в `generators.json`:

```json
{
  "generators": {
    "counter-app": {
      "factory": "./counter-app",
      "schema": "./schema.json",
      "description": "Создает приложение-счетчик с базовой функциональностью"
    }
  }
}
```

Это создаст базовую структуру в папке `workspace-generators/` с файлами:
- `<название-генератора>.ts` - основной файл генератора
- `schema.json` - схема параметров
- `schema.d.ts` - TypeScript типы


## Шаг 6: Настройка дополнительных генераторов

Обновите файл `workspace-generators/generators.json` для регистрации всех генераторов:

```json
{
  "generators": {
    "counter-app": {
      "factory": "./counter-app",
      "schema": "./schema.json",
      "description": "Создает React приложение со счетчиком"
    },
    "todo-app": {
      "factory": "./todo-app",
      "schema": "./todo-app-schema.json",
      "description": "Создает React приложение для управления задачами"
    },
    "utils-lib": {
      "factory": "./utils-lib",
      "schema": "./utils-lib-schema.json",
      "description": "Создает библиотеку утилитарных функций"
    }
  }
}
```

## Шаг 7: Настройка автоматической синхронизации

Добавьте в файл `nx.json` настройку автоматической синхронизации:
```json
{
  "sync": {
    "applyChanges": true
  }
}
```

Это позволит автоматически синхронизировать конфигурационные файлы TypeScript при запуске команд.

## Шаг 8: Создание первого приложения

```bash
# Создайте приложение с помощью генератора
nx generate <название-генератора> <название-приложения> [опции]

# Например:
nx generate counter-app my-first-app --category=apps

# Запустите приложение
nx serve <полное-название-проекта>
```

## Доступные генераторы

### 1. counter-app

Создает новое React приложение со счетчиком.

**Использование:**
```bash
nx generate counter-app <название> --category=<категория>
```

**Параметры:**
- `name` (обязательный) - название приложения
- `category` (обязательный) - категория для организации (например: apps, tools)

**Пример:**
```bash
nx generate counter-app my-counter --category=apps
```

**Создает:**
- React приложение с Vite
- E2E тесты с Cypress
- Компонент счетчика с состоянием
- Стили и конфигурационные файлы

### 2. todo-app

Создает React приложение с функциональностью todo-списка, включая добавление, редактирование, удаление задач, фильтрацию по статусу и систему приоритетов.

**Использование:**
```bash
nx generate todo-app <название> [опции]
```

**Параметры:**
- `name` (обязательный) — название приложения
- `category` — категория проекта (по умолчанию: "apps")
- `title` — заголовок приложения (по умолчанию: "Todo App")
- `enableFilters` — включить фильтрацию по статусу (по умолчанию: true)
- `enablePriority` — включить систему приоритетов (по умолчанию: true)

**Примеры:**
```bash
# Создать базовое todo приложение
nx generate todo-app my-todo --category=apps

# Создать приложение с кастомным заголовком
nx generate todo-app project-tasks --title="Задачи проекта" --category=apps

# Создать приложение без системы приоритетов
nx generate todo-app simple-todo --enablePriority=false --category=apps

# Создать приложение только с базовой функциональностью
nx generate todo-app basic-todo --enableFilters=false --enablePriority=false --category=apps
```

**Создает:**
- React приложение с Vite
- E2E тесты с Cypress
- Компонент TodoApp с полной функциональностью:
  - Добавление новых задач
  - Редактирование существующих задач
  - Удаление задач
  - Отметка задач как выполненных
  - Фильтрация по статусу (все/активные/выполненные)
  - Система приоритетов (высокий/средний/низкий)
  - Счетчик активных задач
- Адаптивный дизайн с современным UI
- Стили и конфигурационные файлы

### 3. utils-lib

Создает библиотеку утилитарных функций с опциональными тестами и Storybook.

**Использование:**
```bash
nx generate utils-lib <название> [опции]
```

**Параметры:**
- `name` (обязательный) — название библиотеки
- `category` — категория (libs, tools, shared)
- `description` — описание библиотеки
- `includeTests` — включить тесты (по умолчанию: true)
- `includeStorybook` — включить Storybook (по умолчанию: false)

**Примеры:**
```bash
# Создать базовую библиотеку утилит
nx generate utils-lib common-utils --category=libs

# Создать библиотеку с описанием и тестами
nx generate utils-lib string-helpers --description="Утилиты для работы со строками" --includeTests=true --category=libs

# Создать библиотеку со Storybook
nx generate utils-lib ui-helpers --category=shared --includeStorybook=true
```

**Создает:**
- Утилитарную библиотеку в `micro-repos/libs/<название>/`
- Набор полезных утилитарных функций:
  - `toCamelCase` — преобразование в camelCase
  - `toKebabCase` — преобразование в kebab-case
  - `delay` — асинхронная задержка
  - `isEmpty` — проверка на пустоту
  - `deepClone` — глубокое клонирование объектов
- Тесты для всех функций (если включены)
- README с документацией
- TypeScript конфигурация

## Разработка и расширение

### Создание нового генератора

1. Создайте файл генератора в `workspace-generators/`
2. Определите схему в соответствующем JSON файле
3. Зарегистрируйте генератор в `generators.json`
4. Создайте шаблоны в папке `<генератор>-files/`

### Структура генератора

```typescript
export async function myGenerator(
  tree: Tree,
  options: MyGeneratorSchema
) {
  // Логика создания проекта
  await formatFiles(tree);
  return () => {
    installPackagesTask(tree);
  };
}
```

## Особенности архитектуры

### Автоматическая организация файлов

Все генераторы автоматически:
- Размещают проекты в правильной структуре папок
- Настраивают корректные пути в конфигурационных файлах
- Создают соответствующие E2E тесты в отдельной папке
- Обновляют зависимости и метаданные проекта

### Исправление путей

Генераторы автоматически исправляют пути в:
- `tsconfig.json` — для корректного наследования базовой конфигурации
- `project.json` — для правильных схем и sourceRoot
- E2E конфигурациях — для корректной работы тестов

### Именование проектов

Проекты автоматически получают префиксы:
- Приложения: `micro-repos-apps-<название>`
- Библиотеки: `micro-repos-libs-<название>`
- E2E тесты: `micro-repos-apps-<название>-e2e`

## Миграция и обновление проектов

### Ограничения генераторов

Важно понимать, что генераторы Nx работают как "одноразовые" инструменты:
- Они копируют файлы-шаблоны только в момент создания проекта
- После создания связь с исходными шаблонами теряется
- Изменения в папках `*-files/` не применяются автоматически к существующим проектам

### Варианты обновления существующих проектов

#### 1. Ручное обновление
Самый простой и безопасный способ:
```bash
# Сравните файлы в workspace-generators/*-files/ с вашими проектами
# Скопируйте нужные изменения вручную
```

#### 2. Пересоздание проектов
Для критических обновлений:
```bash
# Сохраните пользовательские изменения
# Удалите старый проект
nx remove <название-проекта>

# Создайте новый с обновленным генератором
nx generate <генератор> <название> [опции]

# Восстановите пользовательские изменения
```

#### 3. Создание миграционного скрипта
Для автоматизации обновлений можно создать отдельный скрипт:
```typescript
// migration-script.ts
import { Tree, readProjectConfiguration } from '@nx/devkit';

export function migrateProject(tree: Tree, projectName: string) {
  // Логика обновления конкретных файлов
  // Безопасное слияние изменений
}
```

#### 4. Использование shared библиотек
Рекомендуемый подход для будущих проектов:
```bash
# Создайте shared библиотеку для общих компонентов
nx generate utils-lib shared-components --category=shared

# Выносите переиспользуемую логику в библиотеки
# Обновляйте библиотеки централизованно
```

### Рекомендации по архитектуре

1. **Минимизируйте код в генераторах** — используйте их только для создания базовой структуры
2. **Выносите общую логику в библиотеки** — это позволит обновлять функциональность централизованно
3. **Документируйте изменения** — ведите changelog для генераторов
4. **Тестируйте генераторы** — создавайте тесты для проверки корректности создаваемых проектов

## Troubleshooting

### Проблемы с путями
Если возникают ошибки с путями в `tsconfig.json` или `project.json`:
```bash
# Проверьте корректность путей
nx show project <название-проекта>

# Синхронизируйте конфигурацию
nx sync
```

### Проблемы с зависимостями
```bash
# Переустановите зависимости
rm -rf node_modules package-lock.json
npm install

# Или с yarn
rm -rf node_modules yarn.lock
yarn install
```

### Проблемы с кэшем
```bash
# Очистите кэш Nx
nx reset

# Очистите кэш Node.js
npm cache clean --force
```

## Полезные команды Nx

```bash
# Показать граф зависимостей
nx graph

# Показать информацию о проекте
nx show project <название-проекта>

# Запустить команду для всех проектов
nx run-many --target=build --all

# Запустить команду только для измененных проектов
nx affected --target=test

# Очистить кэш
nx reset
```

## Дополнительные возможности Nx

### Производительность и оптимизация

#### Умное кэширование
```bash
# Nx автоматически кэширует результаты сборки и тестов
nx build my-app  # Первый запуск - полная сборка
nx build my-app  # Второй запуск - из кэша (мгновенно)

# Просмотр статистики кэша
nx show project my-app --web
```

#### Команды affected
```bash
# Запустить тесты только для измененных проектов
nx affected --target=test

# Собрать только измененные проекты
nx affected --target=build

# Показать какие проекты затронуты изменениями
nx affected:graph
```

#### Параллельное выполнение
```bash
# Запустить команду для всех проектов параллельно
nx run-many --target=build --all --parallel=3

# Запустить линтинг для всех проектов
nx run-many --target=lint --all
```

### Архитектурные возможности

#### Граф зависимостей
```bash
# Визуализация зависимостей проекта
nx graph

# Граф для конкретного проекта
nx graph --focus=my-app

# Граф только для библиотек
nx graph --projects=libs
```

#### Теги и ограничения
```json
// nx.json
{
  "namedInputs": {
    "default": ["{projectRoot}/**/*"]
  },
  "targetDefaults": {
    "build": {
      "dependsOn": ["^build"]
    }
  },
  "generators": {
    "@nx/react:application": {
      "style": "scss",
      "linter": "eslint",
      "bundler": "vite"
    }
  }
}
```

#### Принудительные границы модулей
```typescript
// eslint.config.js
module.exports = {
  rules: {
    '@nx/enforce-module-boundaries': [
      'error',
      {
        enforceBuildableLibDependency: true,
        allow: [],
        depConstraints: [
          {
            sourceTag: 'scope:shared',
            onlyDependOnLibsWithTags: ['scope:shared']
          },
          {
            sourceTag: 'type:app',
            onlyDependOnLibsWithTags: ['type:feature', 'type:ui', 'type:util']
          }
        ]
      }
    ]
  }
};
```

### Инструменты разработки

#### Workspace генераторы
```bash
# Создание кастомного генератора
nx generate @nx/plugin:generator my-generator --directory=tools/generators

# Запуск кастомного генератора
nx generate my-generator my-project
```

#### Executors (исполнители)
```bash
# Создание кастомного executor
nx generate @nx/plugin:executor my-executor --directory=tools/executors

# Использование в project.json
{
  "targets": {
    "custom-build": {
      "executor": "./tools/executors/my-executor:build",
      "options": {}
    }
  }
}
```

#### Миграции
```bash
# Обновление Nx и плагинов
nx migrate latest

# Применение миграций
nx migrate --run-migrations
```

### Плагины и интеграции

#### Популярные плагины
```bash
# Установка дополнительных плагинов
npm install --save-dev @nx/next @nx/nest @nx/storybook

# Angular
npm install --save-dev @nx/angular

# Node.js
npm install --save-dev @nx/node

# Express
npm install --save-dev @nx/express
```

#### Создание собственного плагина
```bash
# Создание плагина
nx generate @nx/plugin:plugin my-plugin

# Публикация плагина
npm publish
```

### Анализ и мониторинг

#### Nx Console
- Расширение для VS Code
- Графический интерфейс для команд Nx
- Визуализация проектов и зависимостей

#### Nx Cloud
```bash
# Подключение к Nx Cloud для распределенного кэширования
nx connect-to-nx-cloud

# Просмотр статистики в облаке
nx view-logs
```

#### Анализ размера бандла
```bash
# Анализ размера сборки
nx build my-app --analyze

# Детальный отчет о зависимостях
nx dep-graph --file=output.json
```

### Продвинутые возможности

#### Module Federation
```bash
# Создание host приложения
nx generate @nx/react:host shell --remotes=mfe1,mfe2

# Создание remote приложения
nx generate @nx/react:remote mfe1 --host=shell
```

#### Workspace библиотеки
```bash
# Создание publishable библиотеки
nx generate @nx/js:library my-lib --publishable --importPath=@myorg/my-lib

# Сборка библиотеки
nx build my-lib

# Публикация
npm publish dist/libs/my-lib
```

#### Конфигурация задач
```json
// project.json
{
  "targets": {
    "build": {
      "executor": "@nx/vite:build",
      "outputs": ["{options.outputPath}"],
      "options": {
        "outputPath": "dist/apps/my-app"
      },
      "configurations": {
        "production": {
          "mode": "production"
        },
        "development": {
          "mode": "development"
        }
      }
    }
  }
}
```

### CI/CD оптимизации

#### GitHub Actions
```yaml
# .github/workflows/ci.yml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  main:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      - uses: nrwl/nx-set-shas@v3
      - run: npm ci
      - run: npx nx affected --target=lint --parallel=3
      - run: npx nx affected --target=test --parallel=3 --ci --code-coverage
      - run: npx nx affected --target=build --parallel=3
```

#### Distributed Task Execution
```bash
# Распределенное выполнение задач
nx affected --target=test --parallel=3 --dte
```

### Утилиты и команды

#### Полезные команды
```bash
# Показать все проекты
nx show projects

# Показать конфигурацию проекта
nx show project my-app

# Запустить команду с подробным выводом
nx build my-app --verbose

# Сухой запуск (показать что будет выполнено)
nx build my-app --dry-run

# Принудительное выполнение (игнорировать кэш)
nx build my-app --skip-nx-cache
```

#### Конфигурация workspace
```json
// nx.json
{
  "extends": "nx/presets/npm.json",
  "tasksRunnerOptions": {
    "default": {
      "runner": "nx/tasks-runners/default",
      "options": {
        "cacheableOperations": ["build", "lint", "test", "e2e"]
      }
    }
  },
  "targetDefaults": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["production", "^production"]
    },
    "test": {
      "inputs": ["default", "^production", "{workspaceRoot}/jest.preset.js"]
    }
  }
}
```

## Полезные ссылки

- [Документация Nx](https://nx.dev/getting-started/intro)
- [Nx React Plugin](https://nx.dev/packages/react)
- [Nx Generators](https://nx.dev/extending-nx/generators/getting-started)
- [Nx Cloud](https://nx.app/)
- [Nx Console](https://marketplace.visualstudio.com/items?itemName=nrwl.angular-console)
- [Module Federation](https://nx.dev/concepts/module-federation/module-federation-and-nx)
- [Playwright Testing](https://playwright.dev/)
- [Vitest](https://vitest.dev/)
- [Storybook](https://storybook.js.org/)
- [Cypress](https://www.cypress.io/)

---

**Примечание:** Этот workspace настроен для эффективной разработки микро-приложений с автоматизированным управлением структурой проекта и зависимостями.