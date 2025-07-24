// Утилиты для работы с числами
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('ru-RU').format(num);
};

export const randomBetween = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Утилиты для работы со строками
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncate = (str: string, length: number): string => {
  return str.length > length ? str.slice(0, length) + '...' : str;
};

// Утилиты для работы с датами
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('ru-RU').format(date);
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

// Хук для локального хранилища
export const useLocalStorage = (key: string, initialValue: any) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: any) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Ошибка сохранения в localStorage:', error);
    }
  };

  return [storedValue, setValue];
};

// Импорт React для хука
import { useState } from 'react';