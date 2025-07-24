import { useState } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
}

interface TodoAppProps {
  title: string;
  enableFilters?: boolean;
  enablePriority?: boolean;
}

type FilterType = 'all' | 'active' | 'completed';

export function TodoApp({
  title,
  enableFilters = true,
  enablePriority = false,
}: TodoAppProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [nextId, setNextId] = useState(1);

  const addTodo = () => {
    if (inputValue.trim()) {
      const newTodo: Todo = {
        id: nextId,
        text: inputValue.trim(),
        completed: false,
        ...(enablePriority && { priority: 'medium' }),
      };
      setTodos([...todos, newTodo]);
      setInputValue('');
      setNextId(nextId + 1);
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const updatePriority = (id: number, priority: 'low' | 'medium' | 'high') => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, priority } : todo))
    );
  };

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeTodosCount = todos.filter((todo) => !todo.completed).length;
  const completedTodosCount = todos.filter((todo) => todo.completed).length;

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return '#ff4757';
      case 'medium':
        return '#ffa502';
      case 'low':
        return '#2ed573';
      default:
        return '#ddd';
    }
  };

  return (
    <div className="todo-app">
      <h1 className="todo-title">{title}</h1>

      <div className="todo-input-section">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Добавить новую задачу..."
          className="todo-input"
        />
        <button onClick={addTodo} className="todo-add-button">
          Добавить
        </button>
      </div>

      {enableFilters && (
        <div className="todo-filters">
          <button
            onClick={() => setFilter('all')}
            className={`filter-button ${filter === 'all' ? 'active' : ''}`}
          >
            Все ({todos.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`filter-button ${filter === 'active' ? 'active' : ''}`}
          >
            Активные ({activeTodosCount})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`filter-button ${
              filter === 'completed' ? 'active' : ''
            }`}
          >
            Завершенные ({completedTodosCount})
          </button>
        </div>
      )}

      <div className="todo-list">
        {filteredTodos.length === 0 ? (
          <div className="todo-empty">
            {filter === 'all'
              ? 'Нет задач'
              : filter === 'active'
              ? 'Нет активных задач'
              : 'Нет завершенных задач'}
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className={`todo-item ${todo.completed ? 'completed' : ''}`}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="todo-checkbox"
              />
              <span className="todo-text">{todo.text}</span>

              {enablePriority && (
                <select
                  value={todo.priority || 'medium'}
                  onChange={(e) =>
                    updatePriority(
                      todo.id,
                      e.target.value as 'low' | 'medium' | 'high'
                    )
                  }
                  className="todo-priority"
                  style={{ borderColor: getPriorityColor(todo.priority) }}
                >
                  <option value="low">Низкий</option>
                  <option value="medium">Средний</option>
                  <option value="high">Высокий</option>
                </select>
              )}

              <button
                onClick={() => deleteTodo(todo.id)}
                className="todo-delete-button"
              >
                Удалить
              </button>
            </div>
          ))
        )}
      </div>

      {completedTodosCount > 0 && (
        <div className="todo-actions">
          <button onClick={clearCompleted} className="todo-clear-button">
            Очистить завершенные ({completedTodosCount})
          </button>
        </div>
      )}

      <div className="todo-stats">
        <span>Всего задач: {todos.length}</span>
        <span>Активных: {activeTodosCount}</span>
        <span>Завершенных: {completedTodosCount}</span>
      </div>
    </div>
  );
}

export default TodoApp;
