import Counter from './src/components/Counter';
import './src/components/Counter.css';
// Импортируем утилиты из нашей библиотеки
import { formatNumber, capitalize, formatDate, randomBetween, useLocalStorage } from '@./libs';
import { useState } from 'react';

export function App() {
  const [count, setCount] = useLocalStorage('app-counter', 0);
  const [randomNum, setRandomNum] = useState(0);

  const generateRandom = () => {
    setRandomNum(randomBetween(1, 1000));
  };

  return (
    <div
      style={{
        padding: '20px',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <h1>{capitalize('демонстрация использования библиотеки')}</h1>
      
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: 'white', borderRadius: '8px' }}>
        <h3>Утилиты из библиотеки:</h3>
        <p><strong>Текущая дата:</strong> {formatDate(new Date())}</p>
        <p><strong>Форматированное число:</strong> {formatNumber(123456.789)}</p>
        <p><strong>Случайное число:</strong> {formatNumber(randomNum)}</p>
        <button onClick={generateRandom} style={{ padding: '8px 16px', marginTop: '10px' }}>
          Генерировать случайное число
        </button>
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: 'white', borderRadius: '8px' }}>
        <h3>Счетчик с localStorage:</h3>
        <p>Значение сохраняется в браузере: <strong>{formatNumber(count)}</strong></p>
        <button onClick={() => setCount(count + 1)} style={{ padding: '8px 16px', marginRight: '10px' }}>
          +1
        </button>
        <button onClick={() => setCount(count - 1)} style={{ padding: '8px 16px', marginRight: '10px' }}>
          -1
        </button>
        <button onClick={() => setCount(0)} style={{ padding: '8px 16px' }}>
          Сброс
        </button>
      </div>

      <Counter title="Обычный счетчик" initialValue={0} />
    </div>
  );
}

export default App;
