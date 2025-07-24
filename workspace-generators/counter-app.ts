import {
  Tree,
  formatFiles,
  installPackagesTask,
  generateFiles,
  joinPathFragments,
} from '@nx/devkit';
import { applicationGenerator } from '@nx/react';
import { CounterAppGeneratorSchema } from './schema';

export async function counterAppGenerator(
  tree: Tree,
  options: CounterAppGeneratorSchema
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
    joinPathFragments(__dirname, 'files'),
    `${projectName}/src/app`,
    {
      ...options,
      title: options.title || 'Счетчик',
      tmpl: '',
    }
  );
  
  // Перемещаем проект в нужную папку micro-repos
  if (tree.exists(projectName)) {
    const targetPath = `${projectDirectory}/${options.name}`;
    tree.rename(projectName, targetPath);
  }

  // Перемещаем e2e проект в папку micro-repos/e2e
  const e2eProjectName = `${projectName}-e2e`;
  if (tree.exists(e2eProjectName)) {
    const e2eTargetPath = `micro-repos/e2e/${options.name}-e2e`;
    tree.rename(e2eProjectName, e2eTargetPath);
    
    // Исправляем пути в конфигурационных файлах e2e проекта
    const e2eProjectJsonPath = `${e2eTargetPath}/project.json`;
    if (tree.exists(e2eProjectJsonPath)) {
      const projectJsonContent = tree.read(e2eProjectJsonPath, 'utf-8');
      if (projectJsonContent) {
        const updatedContent = projectJsonContent
          .replace('"../node_modules/nx/schemas/project-schema.json"', '"../../../node_modules/nx/schemas/project-schema.json"')
          .replace(`"${e2eProjectName}/src"`, `"micro-repos/e2e/${options.name}-e2e/src"`);
        tree.write(e2eProjectJsonPath, updatedContent);
      }
    }
    
    const e2eTsconfigPath = `${e2eTargetPath}/tsconfig.json`;
    if (tree.exists(e2eTsconfigPath)) {
      const tsconfigContent = tree.read(e2eTsconfigPath, 'utf-8');
      if (tsconfigContent) {
        const updatedContent = tsconfigContent.replace('"../tsconfig.base.json"', '"../../../tsconfig.base.json"');
        tree.write(e2eTsconfigPath, updatedContent);
      }
    }
  }

  await formatFiles(tree);
  return () => {
    installPackagesTask(tree);
  };
}

export default counterAppGenerator;
