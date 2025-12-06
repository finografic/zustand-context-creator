import type { StoreApi } from 'zustand';
import { act, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { createStore } from 'zustand';
import { createZustandContext } from '../src/utils/zustand-context';

describe('createZustandContext', () => {
  describe('basic functionality', () => {
    it('should create a context with Provider, Context, and useContext', () => {
      interface TestStore {
        count: number
        increment: () => void
      }

      const TestContext = createZustandContext<{ count: number }, StoreApi<TestStore>>(
        ({ initialValue }) => {
          return createStore<TestStore>()(set => ({
            count: initialValue?.count ?? 0,
            increment: () => set(state => ({ count: state.count + 1 })),
          }));
        },
      );

      expect(TestContext.Context).toBeDefined();
      expect(TestContext.Provider).toBeDefined();
      expect(TestContext.useContext).toBeDefined();
      expect(typeof TestContext.useContext).toBe('function');
    });

    it('should create a store with default values when no initialValue provided', () => {
      interface TestStore {
        name: string
      }

      const defaultValue = { name: 'Default' };

      const TestContext = createZustandContext<{ name: string }, StoreApi<TestStore>>(
        ({ initialValue }) => {
          return createStore<TestStore>()(() => ({
            name: initialValue?.name ?? defaultValue.name,
          }));
        },
      );

      const TestComponent = () => {
        const store = TestContext.useContext();
        if (!store)
          return <div>No store</div>;
        return <div>{store.getState().name}</div>;
      };

      render(
        <TestContext.Provider>
          <TestComponent />
        </TestContext.Provider>,
      );

      expect(screen.getByText('Default')).toBeInTheDocument();
    });

    it('should create a store with initialValue when provided', () => {
      interface TestStore {
        count: number
      }

      const TestContext = createZustandContext<{ count: number }, StoreApi<TestStore>>(
        ({ initialValue }) => {
          return createStore<TestStore>()(() => ({
            count: initialValue?.count ?? 0,
          }));
        },
      );

      const TestComponent = () => {
        const store = TestContext.useContext();
        if (!store)
          return <div>No store</div>;
        return <div>{store.getState().count}</div>;
      };

      render(
        <TestContext.Provider initialValue={{ count: 42 }}>
          <TestComponent />
        </TestContext.Provider>,
      );

      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('should return null from useContext when used outside Provider', () => {
      interface TestStore {
        value: string
      }

      const TestContext = createZustandContext<{ value: string }, StoreApi<TestStore>>(
        ({ initialValue }) => {
          return createStore<TestStore>()(() => ({
            value: initialValue?.value ?? 'default',
          }));
        },
      );

      const TestComponent = () => {
        const store = TestContext.useContext();
        return <div>{store ? 'Has store' : 'No store'}</div>;
      };

      render(<TestComponent />);

      expect(screen.getByText('No store')).toBeInTheDocument();
    });
  });

  describe('store updates', () => {
    it('should allow store state updates', () => {
      interface TestStore {
        count: number
        increment: () => void
      }

      const TestContext = createZustandContext<{ count: number }, StoreApi<TestStore>>(
        ({ initialValue }) => {
          return createStore<TestStore>()(set => ({
            count: initialValue?.count ?? 0,
            increment: () => set(state => ({ count: state.count + 1 })),
          }));
        },
      );

      const TestComponent = () => {
        const store = TestContext.useContext();
        const [count, setCount] = React.useState(0);

        React.useEffect(() => {
          if (!store)
            return;
          setCount(store.getState().count);
          const unsubscribe = store.subscribe((state) => {
            setCount(state.count);
          });
          return unsubscribe;
        }, [store]);

        if (!store)
          return <div>No store</div>;

        return (
          <div>
            <span data-testid="count">{count}</span>
            <button
              data-testid="increment"
              onClick={() => store.getState().increment()}
            >
              Increment
            </button>
          </div>
        );
      };

      render(
        <TestContext.Provider>
          <TestComponent />
        </TestContext.Provider>,
      );

      expect(screen.getByTestId('count')).toHaveTextContent('0');

      act(() => {
        screen.getByTestId('increment').click();
      });

      expect(screen.getByTestId('count')).toHaveTextContent('1');
    });
  });

  describe('multiple instances', () => {
    it('should create independent store instances for different Providers', () => {
      interface TestStore {
        id: string
      }

      const TestContext = createZustandContext<{ id: string }, StoreApi<TestStore>>(
        ({ initialValue }) => {
          return createStore<TestStore>()(() => ({
            id: initialValue?.id ?? 'default',
          }));
        },
      );

      const TestComponent = () => {
        const store = TestContext.useContext();
        if (!store)
          return <div>No store</div>;
        return <div data-testid="id">{store.getState().id}</div>;
      };

      const { rerender } = render(
        <TestContext.Provider initialValue={{ id: 'first' }}>
          <TestComponent />
        </TestContext.Provider>,
      );

      expect(screen.getByTestId('id')).toHaveTextContent('first');

      rerender(
        <TestContext.Provider initialValue={{ id: 'second' }}>
          <TestComponent />
        </TestContext.Provider>,
      );

      // Store should be created once and not change
      expect(screen.getByTestId('id')).toHaveTextContent('first');
    });
  });

  describe('children handling', () => {
    it('should render children correctly', () => {
      interface TestStore {
        value: string
      }

      const TestContext = createZustandContext<{ value: string }, StoreApi<TestStore>>(
        ({ initialValue }) => {
          return createStore<TestStore>()(() => ({
            value: initialValue?.value ?? 'default',
          }));
        },
      );

      render(
        <TestContext.Provider>
          <div data-testid="child">Child Content</div>
        </TestContext.Provider>,
      );

      expect(screen.getByTestId('child')).toHaveTextContent('Child Content');
    });

    it('should handle undefined children', () => {
      interface TestStore {
        value: string
      }

      const TestContext = createZustandContext<{ value: string }, StoreApi<TestStore>>(
        ({ initialValue }) => {
          return createStore<TestStore>()(() => ({
            value: initialValue?.value ?? 'default',
          }));
        },
      );

      const { container } = render(<TestContext.Provider />);

      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
