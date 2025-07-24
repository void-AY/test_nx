import {
  Tree,
  formatFiles,
  installPackagesTask,
  generateFiles,
  joinPathFragments,
} from '@nx/devkit';
import { applicationGenerator } from '@nx/react';
import { TodoAppGeneratorSchema } from './todo-app-schema';

export async function todoAppGenerator(
  tree: Tree,
  options: TodoAppGeneratorSchema
) {
  // Определяем путь для проекта в micro-repos
  const category = options.category || 'apps';
  const projectName = `micro-repos-${category}-${options.name}`;
  const projectDirectory = `micro-repos/${category}`;
  
  // Создаем базовое React приложение
  await applicationGenerator(tree, {
      name: projectName,
      style: 'scss',
      bundler: 'vite',
      unitTestRunner: 'vitest',
      e2eTestRunner: 'playwright',
      directory: '',
      linter: 'none'
  });

  // Генерируем файлы из шаблонов
  generateFiles(
    tree,
    joinPathFragments(__dirname, 'todo-app-files'),
    `${projectName}/src/app`,
    {
      ...options,
      title: options.title || 'Список задач',
      tmpl: '',
    }
  );
  
  // Перемещаем проект в нужную папку micro-repos
  if (tree.exists(projectName)) {
    const targetPath = `${projectDirectory}/${options.name}`;
    tree.rename(projectName, targetPath);
    
    // Исправляем пути в конфигурационных файлах основного проекта
    const mainProjectJsonPath = `${targetPath}/project.json`;
    if (tree.exists(mainProjectJsonPath)) {
      const projectJson = JSON.parse(tree.read(mainProjectJsonPath, 'utf-8'));
      projectJson['$schema'] = '../../../node_modules/nx/schemas/project-schema.json';
      projectJson.sourceRoot = `micro-repos/${category}/${options.name}/src`;
      tree.write(mainProjectJsonPath, JSON.stringify(projectJson, null, 2));
    }

    // Исправляем пути в tsconfig.json основного проекта
    const mainTsconfigPath = `${targetPath}/tsconfig.json`;
    if (tree.exists(mainTsconfigPath)) {
      const tsconfig = JSON.parse(tree.read(mainTsconfigPath, 'utf-8'));
      tsconfig.extends = '../../../tsconfig.base.json';
      tree.write(mainTsconfigPath, JSON.stringify(tsconfig, null, 2));
    }
  }

  // Перемещаем e2e проект в папку micro-repos/e2e
  const e2eProjectName = `${projectName}-e2e`;
  if (tree.exists(e2eProjectName)) {
    const e2eTargetPath = `micro-repos/e2e/${options.name}-e2e`;
    tree.rename(e2eProjectName, e2eTargetPath);
    
    // Исправляем пути в конфигурационных файлах e2e проекта
    const e2eProjectJsonPath = `${e2eTargetPath}/project.json`;
    if (tree.exists(e2eProjectJsonPath)) {
      const projectJson = JSON.parse(tree.read(e2eProjectJsonPath, 'utf-8'));
      projectJson['$schema'] = '../../../node_modules/nx/schemas/project-schema.json';
      projectJson.sourceRoot = `micro-repos/e2e/${options.name}-e2e/src`;
      tree.write(e2eProjectJsonPath, JSON.stringify(projectJson, null, 2));
    }
    
    const e2eTsconfigPath = `${e2eTargetPath}/tsconfig.json`;
    if (tree.exists(e2eTsconfigPath)) {
      const tsconfig = JSON.parse(tree.read(e2eTsconfigPath, 'utf-8'));
      tsconfig.extends = '../../../tsconfig.base.json';
      tree.write(e2eTsconfigPath, JSON.stringify(tsconfig, null, 2));
    }
  }

  await formatFiles(tree);
  return () => {
    installPackagesTask(tree);
  };
}

export default todoAppGenerator;