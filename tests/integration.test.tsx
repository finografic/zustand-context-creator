import type { StoreApi } from 'zustand';
import { act, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { createStore, useStore } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import { createZustandContext } from '../src/utils/zustand-context';
import { createSetters } from '../src/utils/zustand-setters';

describe('integration Tests', () => {
  describe('createZustandContext + createSetters', () => {
    interface AppConfigValues {
      theme: 'light' | 'dark'
      language: string
    }

    type AppConfigStore = AppConfigValues & {
      actions: {
        setAppConfigTheme: (theme: 'light' | 'dark') => void
        setAppConfigLanguage: (language: string) => void
        toggleTheme: () => void
      }
    };

    const defaultValue: AppConfigValues = {
      theme: 'light',
      language: 'en',
    };

    const SETTER_PREFIX = 'AppConfig';

    const AppConfigContext = createZustandContext<AppConfigValues, StoreApi<AppConfigStore>>(
      ({ initialValue }) => {
        return createStore<AppConfigStore>()(
          subscribeWithSelector(
            (set, _get): AppConfigStore => ({
              ...defaultValue,
              ...initialValue,
              actions: {
                ...createSetters({ set: set as any, defaultValue, prefix: SETTER_PREFIX }),
                toggleTheme: () => {
                  set(state => ({
                    theme: state.theme === 'light' ? 'dark' : 'light',
                  }));
                },
              },
            }),
          ),
        );
      },
    );

    type AppConfigReturn = Omit<AppConfigStore, 'actions'> & AppConfigStore['actions'];

    const useAppConfig = (): AppConfigReturn => {
      const store = AppConfigContext.useContext();
      if (!store) {
        throw new Error('useAppConfig must be used within an AppConfigProvider');
      }

      return useStore<StoreApi<AppConfigStore>, AppConfigReturn>(
        store,
        useShallow(({ actions, ...state }) => ({
          ...state,
          ...actions,
        })),
      );
    };

    it('should work with full integration pattern', () => {
      const TestComponent = () => {
        const { theme, language, setAppConfigTheme, setAppConfigLanguage, toggleTheme } = useAppConfig();

        return (
          <div>
            <div data-testid="theme">{theme}</div>
            <div data-testid="language">{language}</div>
            <button
              data-testid="set-dark"
              onClick={() => setAppConfigTheme('dark')}
            >
              Set Dark
            </button>
            <button
              data-testid="set-language"
              onClick={() => setAppConfigLanguage('es')}
            >
              Set Language
            </button>
            <button
              data-testid="toggle"
              onClick={toggleTheme}
            >
              Toggle
            </button>
          </div>
        );
      };

      render(
        <AppConfigContext.Provider>
          <TestComponent />
        </AppConfigContext.Provider>,
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('light');
      expect(screen.getByTestId('language')).toHaveTextContent('en');

      act(() => {
        screen.getByTestId('set-dark').click();
      });

      expect(screen.getByTestId('theme')).toHaveTextContent('dark');

      act(() => {
        screen.getByTestId('set-language').click();
      });

      expect(screen.getByTestId('language')).toHaveTextContent('es');

      act(() => {
        screen.getByTestId('toggle').click();
      });

      expect(screen.getByTestId('theme')).toHaveTextContent('light');
    });

    it('should work with initialValue', () => {
      const TestComponent = () => {
        const { theme, language } = useAppConfig();

        return (
          <div>
            <div data-testid="theme">{theme}</div>
            <div data-testid="language">{language}</div>
          </div>
        );
      };

      render(
        <AppConfigContext.Provider initialValue={{ theme: 'dark', language: 'fr' }}>
          <TestComponent />
        </AppConfigContext.Provider>,
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
      expect(screen.getByTestId('language')).toHaveTextContent('fr');
    });

    it('should throw error when used outside Provider', () => {
      const TestComponent = () => {
        try {
          useAppConfig();
          return <div>No error</div>;
        }
        catch (error) {
          return <div data-testid="error">{(error as Error).message}</div>;
        }
      };

      render(<TestComponent />);

      expect(screen.getByTestId('error')).toHaveTextContent(
        'useAppConfig must be used within an AppConfigProvider',
      );
    });
  });

  describe('complex store with multiple setters and custom actions', () => {
    interface TodoItem {
      id: string
      text: string
      completed: boolean
    }

    interface TodoValues {
      items: TodoItem[]
      filter: 'all' | 'active' | 'completed'
    }

    type TodoStore = TodoValues & {
      actions: {
        setItems: (items: TodoItem[]) => void
        setFilter: (filter: 'all' | 'active' | 'completed') => void
        addTodo: (text: string) => void
        toggleTodo: (id: string) => void
        clearCompleted: () => void
      }
    };

    const defaultValue: TodoValues = {
      items: [],
      filter: 'all',
    };

    const TodoContext = createZustandContext<TodoValues, StoreApi<TodoStore>>(
      ({ initialValue }) => {
        return createStore<TodoStore>()(
          subscribeWithSelector(
            (set, _get): TodoStore => ({
              ...defaultValue,
              ...initialValue,
              actions: {
                ...createSetters({ set: set as any, defaultValue, prefix: '' }),
                addTodo: (text: string) => {
                  const newTodo: TodoItem = {
                    id: Date.now().toString(),
                    text,
                    completed: false,
                  };
                  set(state => ({
                    items: [...state.items, newTodo],
                  }));
                },
                toggleTodo: (id: string) => {
                  set(state => ({
                    items: state.items.map(item =>
                      item.id === id ? { ...item, completed: !item.completed } : item,
                    ),
                  }));
                },
                clearCompleted: () => {
                  set(state => ({
                    items: state.items.filter(item => !item.completed),
                  }));
                },
              },
            }),
          ),
        );
      },
    );

    type TodoReturn = Omit<TodoStore, 'actions'> & TodoStore['actions'];

    const useTodos = (): TodoReturn => {
      const store = TodoContext.useContext();
      if (!store) {
        throw new Error('useTodos must be used within a TodoProvider');
      }

      return useStore<StoreApi<TodoStore>, TodoReturn>(
        store,
        useShallow(({ actions, ...state }) => ({
          ...state,
          ...actions,
        })),
      );
    };

    it('should handle complex todo operations', () => {
      const TestComponent = () => {
        const { items, filter, setFilter, addTodo, clearCompleted } = useTodos();

        return (
          <div>
            <div data-testid="count">{items.length}</div>
            <div data-testid="filter">{filter}</div>
            <div data-testid="completed">
              {items.filter(item => item.completed).length}
            </div>
            <button
              data-testid="add"
              onClick={() => addTodo('Test Todo')}
            >
              Add
            </button>
            <button
              data-testid="set-filter"
              onClick={() => setFilter('active')}
            >
              Set Filter
            </button>
            <button
              data-testid="clear"
              onClick={clearCompleted}
            >
              Clear
            </button>
          </div>
        );
      };

      render(
        <TodoContext.Provider>
          <TestComponent />
        </TodoContext.Provider>,
      );

      expect(screen.getByTestId('count')).toHaveTextContent('0');
      expect(screen.getByTestId('filter')).toHaveTextContent('all');

      act(() => {
        screen.getByTestId('add').click();
      });

      expect(screen.getByTestId('count')).toHaveTextContent('1');

      act(() => {
        screen.getByTestId('set-filter').click();
      });

      expect(screen.getByTestId('filter')).toHaveTextContent('active');
    });
  });
});
