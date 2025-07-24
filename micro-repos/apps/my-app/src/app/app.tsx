import { useState } from 'react';

export function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Мой счетчик: {count}</h1>
      <div style={{ marginTop: '20px' }}>
        <button
          onClick={() => setCount(count + 1)}
          style={{ marginRight: '10px', padding: '10px 20px' }}
        >
          Увеличить
        </button>
        <button
          onClick={() => setCount(count - 1)}
          style={{ padding: '10px 20px' }}
        >
          Уменьшить
        </button>
      </div>
      <div style={{ marginTop: '20px' }}>
        <button
          onClick={() => setCount(0)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#ff6b6b',
            color: 'white',
            border: 'none',
          }}
        >
          Сбросить
        </button>
      </div>
    </div>
  );
}

export default App;
