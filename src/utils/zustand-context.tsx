import type { StoreApi } from 'zustand';
import React, { createContext } from 'react';

/**
 * Creates a Zustand store with React Context integration
 * @template TInitial - The initial state type
 * @template TStore - The Zustand store API type
 * @param getStore - Function that creates the store with optional initial value
 * @returns Context object with Provider, Context, and useContext hook
 */
export function createZustandContext<TInitial extends object, TStore extends StoreApi<any>>(
  getStore: (props: { initialValue?: Partial<TInitial> }) => TStore,
) {
  const Context = createContext<TStore | null>(null);

  const Provider = ({
    children,
    initialValue = {} as Partial<TInitial>,
  }: {
    children?: React.ReactNode
    initialValue?: Partial<TInitial>
  }) => {
    const [store] = React.useState(() => getStore({ initialValue }));

    return <Context.Provider value={store}>{children}</Context.Provider>;
  };

  return {
    Context,
    Provider,
    useContext: () => React.useContext(Context),
  };
}
