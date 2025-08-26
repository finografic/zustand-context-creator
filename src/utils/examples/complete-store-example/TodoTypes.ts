// TodoTypes.ts
export enum TodoKeys {
  items = 'items',
  filter = 'filter',
  isLoading = 'isLoading',
}

export type TodoItem = {
  id: string;
  text: string;
  completed: boolean;
};

export type TodoValues = {
  [TodoKeys.items]: TodoItem[];
  [TodoKeys.filter]: 'all' | 'active' | 'completed';
  [TodoKeys.isLoading]: boolean;
};

// Define the store type including actions
export type TodoStore = TodoValues & {
  actions: {
    // Auto-generated setters will be in format: `set${DISPLAY_NAME}${key}`
    setTodoItems: (items: TodoItem[]) => void;
    setTodoFilter: (filter: TodoValues['filter']) => void;
    setTodoIsLoading: (isLoading: boolean) => void;

    // Custom actions
    addTodo: (todo: TodoItem) => void;
    toggleTodo: (id: string) => void;
    removeTodo: (id: string) => void;
  };
};
