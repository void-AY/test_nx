import TodoApp from './src/components/TodoApp';
import './src/components/TodoApp.css';

export function App() {
  return (
    <div
      style={{
        padding: '20px',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <TodoApp title="Мои задачи" enableFilters={true} enablePriority={true} />
    </div>
  );
}

export default App;
