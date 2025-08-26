// TodoContext.ts
import { createStore } from 'zustand';
import { createSetters, createZustandContext } from '../../zustand';
import type { TodoStore, TodoValues } from './TodoTypes';
import { TodoKeys } from './TodoTypes';
import { subscribeWithSelector } from 'zustand/middleware';

export const DISPLAY_NAME = 'Todo';
export const SETTER_PREFIX = DISPLAY_NAME;

export const defaultValue: TodoValues = {
  [TodoKeys.items]: [],
  [TodoKeys.filter]: 'all',
  [TodoKeys.isLoading]: false,
};

export const TodoContext = createZustandContext(({ initialValue }) => {
  return createStore<TodoStore>()(
    subscribeWithSelector(
      (set, get): TodoStore => ({
        // Spread default and initial values
        ...defaultValue,
        ...initialValue,

        // Define actions object
        actions: {
          // Auto-generated setters using the enum keys
          ...createSetters({ set, defaultValue, prefix: SETTER_PREFIX }),

          // Custom actions with more complex logic
          addTodo: (todo) => {
            const currentItems = get().items;
            set({ items: [...currentItems, todo] });
          },

          toggleTodo: (id) => {
            const currentItems = get().items;
            set({
              items: currentItems.map((item) =>
                item.id === id ? { ...item, completed: !item.completed } : item,
              ),
            });
          },

          removeTodo: (id) => {
            const currentItems = get().items;
            set({
              items: currentItems.filter((item) => item.id !== id),
            });
          },
        },
      }),
    ),
  );
});
