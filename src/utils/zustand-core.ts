import { type StoreApi } from 'zustand';

const isDev = process.env.NODE_ENV === 'development';

// Enhanced type validation
export const validateInitialState = <T extends Record<string, any>>(
  initialState: Partial<T>,
  enumKeys: Record<string, string>,
  displayName: string,
) => {
  if (isDev) {
    const invalidKeys = Object.keys(initialState).filter((key) => !Object.values(enumKeys).includes(key));
    if (invalidKeys.length > 0) {
      throw new Error(
        `Invalid keys found in ${displayName} initial state: ${invalidKeys.join(
          ', ',
        )}. Valid keys are: ${Object.values(enumKeys).join(', ')}`,
      );
    }
  }
};

// Enhanced selector creation with memoization support
export const createSelector = <T extends object, U>(
  selector: (state: T) => U,
  equalityFn: (a: U, b: U) => boolean = Object.is,
) => {
  let previousResult: U | undefined;
  return (state: T): U => {
    const result = selector(state);
    if (previousResult === undefined || !equalityFn(previousResult, result)) {
      previousResult = result;
    }
    return previousResult;
  };
};

// Development logging utility
export const createDevLogger = (storeName: string) => {
  if (!isDev) return null;

  return {
    logStateChange: (prevState: unknown, nextState: unknown) => {
      console.group(`${storeName} State Change`);
      console.log('Previous:', prevState);
      console.log('Next:', nextState);
      console.log('Diff:', getDiff(prevState, nextState));
      console.groupEnd();
    },
    logAction: (actionName: string, payload?: unknown) => {
      console.group(`${storeName} Action: ${actionName}`);
      if (payload) console.log('Payload:', payload);
      console.groupEnd();
    },
  };
};

// Utility to get state differences
const getDiff = (prev: unknown, next: unknown) => {
  if (typeof prev !== 'object' || typeof next !== 'object') return { prev, next };
  return Object.entries(next as object).reduce(
    (acc, [key, value]) => {
      if ((prev as any)[key] !== value) {
        acc[key] = { prev: (prev as any)[key], next: value };
      }
      return acc;
    },
    {} as Record<string, { prev: unknown; next: unknown }>,
  );
};
