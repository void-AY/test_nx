import {
  Tree,
  formatFiles,
  installPackagesTask,
  generateFiles,
  joinPathFragments,
  names,
} from '@nx/devkit';
import { libraryGenerator } from '@nx/js';

export interface UtilsLibGeneratorSchema {
  name: string;
  category?: 'libs' | 'tools' | 'shared';
  description?: string;
  includeTests?: boolean;
  includeStorybook?: boolean;
}

export default async function (tree: Tree, options: UtilsLibGeneratorSchema) {
  const normalizedOptions = {
    ...options,
    category: options.category ?? 'libs',
    description: options.description ?? 'Utility library',
    includeTests: options.includeTests ?? true,
    includeStorybook: options.includeStorybook ?? false,
  };

  // Создаем базовую библиотеку
  await libraryGenerator(tree, {
    name: normalizedOptions.name,
    directory: `micro-repos/${normalizedOptions.category}/${normalizedOptions.name}`,
    bundler: 'vite',
    unitTestRunner: 'vitest',
    linter: 'eslint',
    strict: true,
    tags: `scope:${normalizedOptions.category},type:util`,
  });

  const projectRoot = `micro-repos/${normalizedOptions.category}/${normalizedOptions.name}`;
  const templateOptions = {
    ...normalizedOptions,
    ...names(normalizedOptions.name),
    tmpl: '',
    projectRoot,
  };

  // Генерируем файлы из шаблонов
  generateFiles(
    tree,
    joinPathFragments(__dirname, 'utils-lib-files'),
    projectRoot,
    templateOptions
  );

  // Обновляем package.json с дополнительными зависимостями
  const packageJsonPath = joinPathFragments(projectRoot, 'package.json');
  if (tree.exists(packageJsonPath)) {
    const packageJsonContent = tree.read(packageJsonPath, 'utf-8');
    if (packageJsonContent) {
      const packageJson = JSON.parse(packageJsonContent);
      packageJson.description = normalizedOptions.description;
      packageJson.keywords = ['utils', 'typescript', 'nx'];
      
      if (normalizedOptions.includeStorybook) {
        packageJson.devDependencies = {
          ...packageJson.devDependencies,
          '@storybook/react': '^7.0.0',
          '@storybook/react-vite': '^7.0.0',
        };
      }
      
      tree.write(packageJsonPath, JSON.stringify(packageJson, null, 2));
    }
  }

  await formatFiles(tree);
  return () => {
    installPackagesTask(tree);
  };
}