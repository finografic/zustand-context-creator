// TodoProvider.tsx
import React from 'react';
import { TodoContext } from './TodoContext';
import type { TodoValues } from './TodoTypes';

interface TodoProviderProps {
  children: React.ReactNode;
  initialValue?: Partial<TodoValues>;
}

export const TodoProvider: React.FC<TodoProviderProps> = ({ children, initialValue }) => {
  return <TodoContext.Provider value={{ initialValue }}>{children}</TodoContext.Provider>;
};

// Usage example:
export const App = () => {
  return (
    <TodoProvider initialValue={{ filter: 'active' }}>
      <TodoList />
      <TodoFilters />
    </TodoProvider>
  );
};

// Hook usage in components
export const TodoList = () => {
  const {
    items,
    isLoading,
    actions: { addTodo, toggleTodo, removeTodo },
  } = TodoContext.useContext();

  if (isLoading) return <div>Loading...</div>;

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          <input type="checkbox" checked={item.completed} onChange={() => toggleTodo(item.id)} />
          <span>{item.text}</span>
          <button onClick={() => removeTodo(item.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};
