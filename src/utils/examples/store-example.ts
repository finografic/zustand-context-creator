import { createStore } from '@your-scope/zustand-store-creator';

// Define your types
type TodoItem = {
  id: string;
  text: string;
  completed: boolean;
};

type FilterType = 'all' | 'active' | 'completed';

// Create your store with a clean, declarative API
const todoStore = createStore({
  // Store name (used for devtools and error messages)
  name: 'Todo',

  // Initial state with type inference
  state: {
    items: [] as TodoItem[],
    filter: 'all' as FilterType,
    isLoading: false,
  },

  // Actions are automatically typed based on state
  actions: {
    // Simple action
    setFilter: (state, newFilter: FilterType) => ({
      filter: newFilter,
    }),

    // Action with multiple state updates
    addTodo: (state, todo: TodoItem) => ({
      items: [...state.items, todo],
    }),

    // Action with computed state
    toggleTodo: (state, id: string) => ({
      items: state.items.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)),
    }),

    // Async action example
    async fetchTodos(state) {
      state.setIsLoading(true);
      try {
        const todos = await fetch('/api/todos').then((r) => r.json());
        return { items: todos, isLoading: false };
      } catch (error) {
        return { isLoading: false };
      }
    },
  },

  // Optional features with sensible defaults
  options: {
    // Enable persistence
    persist: {
      enabled: true,
      name: 'todo-storage', // localStorage key
      whitelist: ['items', 'filter'], // only persist these fields
    },

    // Enable Redux DevTools
    devtools: true,

    // Reset state when component unmounts
    resetOnUnmount: false,

    // Enable selective subscriptions
    enableSelectors: true,
  },
});

// Usage in components remains simple
export const useTodoStore = todoStore.use;
export const todoSelectors = todoStore.select;

// Example usage:
// const { items, addTodo, toggleTodo } = useTodoStore();
// const activeTodos = useTodoStore(todoSelectors.getActiveTodos);
