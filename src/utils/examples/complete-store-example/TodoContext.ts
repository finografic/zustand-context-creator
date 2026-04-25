import type { TodoStore, TodoValues } from './TodoTypes';
// The actual implementation would be in the main package exports
// TodoContext.ts
import { createStore } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { StoreApi } from 'zustand';
// Note: This import path is for example purposes only
// In actual usage, import from '@finografic/zustand-context-creator'
import { createSetters, createZustandContext } from '../../../index';
import { TodoKeys } from './TodoTypes';

export const DISPLAY_NAME = 'Todo';
export const SETTER_PREFIX = DISPLAY_NAME;

export const defaultValue: TodoValues = {
  [TodoKeys.items]: [],
  [TodoKeys.filter]: 'all',
  [TodoKeys.isLoading]: false,
};

export const TodoContext = createZustandContext<TodoValues, StoreApi<TodoStore>>(({ initialValue }) => {
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
