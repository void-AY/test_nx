
import Counter from './src/components/Counter';
import './src/components/Counter.css';

export function App() {
  return (
    <div
      style={{
        padding: '20px',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Counter title="Новый счетчик" initialValue={0} />
    </div>
  );
}

export default App;
