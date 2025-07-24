export interface CounterAppGeneratorSchema {
  name: string;
  title?: string;
  category?: 'apps' | 'libs' | 'tools' | 'experiments';
}

export interface TodoAppGeneratorSchema {
  name: string;
  title?: string;
  category?: 'apps' | 'libs' | 'tools' | 'experiments';
  enableFilters?: boolean;
  enablePriority?: boolean;
}
