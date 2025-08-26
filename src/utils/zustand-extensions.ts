import { type StoreApi } from 'zustand';
import { devtools } from 'zustand/middleware';

// Reset capability
export const withReset = <T extends object>(initialState: T, config = { blacklist: [] as (keyof T)[] }) => {
  return (set: StoreApi<T>['setState']) => ({
    reset: () => {
      const resetState = Object.entries(initialState).reduce((acc, [key, value]) => {
        if (!config.blacklist.includes(key as keyof T)) {
          acc[key] = value;
        }
        return acc;
      }, {} as Partial<T>);
      set(resetState, true);
    },
  });
};

// Persistence middleware creator
export const createPersist = <T extends object>(
  key: string,
  options = {
    whitelist: [] as (keyof T)[],
    blacklist: [] as (keyof T)[],
  },
) => {
  return (set: StoreApi<T>['setState'], get: StoreApi<T>['getState']) => ({
    persist: {
      save: () => {
        const state = get();
        const persistedState = Object.entries(state).reduce((acc, [key, value]) => {
          if (
            (options.whitelist.length === 0 || options.whitelist.includes(key as keyof T)) &&
            !options.blacklist.includes(key as keyof T)
          ) {
            acc[key] = value;
          }
          return acc;
        }, {} as Partial<T>);
        localStorage.setItem(key, JSON.stringify(persistedState));
      },
      load: () => {
        const saved = localStorage.getItem(key);
        if (saved) {
          set(JSON.parse(saved));
        }
      },
    },
  });
};

// Action batching
export const createBatchActions = <T extends object>() => {
  return (set: StoreApi<T>['setState'], get: StoreApi<T>['getState']) => {
    let batchQueue: Array<() => Partial<T>> = [];
    let isBatching = false;

    return {
      batch: {
        start: () => {
          isBatching = true;
        },
        commit: () => {
          if (!isBatching) return;

          const state = get();
          const newState = batchQueue.reduce((acc, action) => ({ ...acc, ...action() }), state);

          set(newState);
          batchQueue = [];
          isBatching = false;
        },
        addAction: (action: () => Partial<T>) => {
          if (isBatching) {
            batchQueue.push(action);
          } else {
            set(action());
          }
        },
      },
    };
  };
};
