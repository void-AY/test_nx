import { useState } from 'react';

interface CounterProps {
  title: string;
  initialValue?: number;
}

export function Counter({ title, initialValue = 0 }: CounterProps) {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(initialValue);

  return (
    <div className="counter">
      <h1 className="counter-title">
        {title}: {count}
      </h1>
      <div className="counter-buttons">
        <button
          onClick={increment}
          className="counter-button counter-button--increment"
        >
          Увеличить
        </button>
        <button
          onClick={decrement}
          className="counter-button counter-button--decrement"
        >
          Уменьшить
        </button>
      </div>
      <div className="counter-reset">
        <button
          onClick={reset}
          className="counter-button counter-button--reset"
        >
          Сбросить
        </button>
      </div>
    </div>
  );
}

export default Counter;
