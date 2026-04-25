// TodoProvider.tsx
import React from 'react';
import { useStore } from 'zustand';
import type { TodoStore, TodoValues } from './TodoTypes';

import { TodoContext } from './TodoContext';

interface TodoProviderProps {
  children: React.ReactNode;
  initialValue?: Partial<TodoValues>;
}

export const TodoProvider: React.FC<TodoProviderProps> = ({ children, initialValue }) => {
  return <TodoContext.Provider initialValue={initialValue}>{children}</TodoContext.Provider>;
};

// Usage example:
const APP_INITIAL_VALUE: Partial<TodoValues> = { filter: 'active' };

export const App = (): React.JSX.Element => {
  return (
    <TodoProvider initialValue={APP_INITIAL_VALUE}>
      <TodoList />
    </TodoProvider>
  );
};

// Hook usage in components
export const TodoList = (): React.JSX.Element => {
  const store = TodoContext.useContext();
  if (!store) {
    return <div>Missing Todo store context</div>;
  }
  const {
    items,
    isLoading,
    actions: { toggleTodo, removeTodo },
  } = useStore(store, (state: TodoStore) => state);

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
