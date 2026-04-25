import type { StoreApi } from 'zustand';

/**
 * Utility type that generates setter function types based on a values object type
 *
 * @template TValues - The values object type
 * @template TPrefix - The prefix to use for setter names (defaults to empty string)
 * @returns Object type with setter functions for each property in TValues
 */
export type CreateSettersType<TValues extends Record<string, any>, TPrefix extends string = ''> = {
  [K in keyof TValues as `set${TPrefix}${Capitalize<string & K>}`]: (val: TValues[K]) => void;
};

/**
 * Creates typed setter functions for Zustand store properties
 *
 * @template TStore - The store type
 * @template TValues - The values object type
 * @template TPrefix - The prefix for setter names
 * @param options - Configuration object
 * @param options.defaultValue - Default values object (used to determine which setters to create)
 * @param options.set - Zustand set function
 * @param options.prefix - Optional prefix for setter names (e.g., 'AppConfig' -> 'setAppConfigProperty')
 * @returns Object with typed setter functions
 */
export function createSetters<
  TStore extends { [K in keyof TValues]: TValues[K] },
  TValues extends Record<string, any>,
  TPrefix extends string = '',
>({
  set,
  prefix = '' as TPrefix,
  defaultValue: defaultValues,
}: {
  defaultValue: TValues;
  set: StoreApi<TStore>['setState'];
  prefix?: TPrefix;
}): CreateSettersType<TValues, TPrefix> {
  const setters: Record<string, (val: TValues[keyof TValues]) => void> = {};
  for (const key of Object.keys(defaultValues) as Array<keyof TValues>) {
    const setterName = `set${prefix}${String(key).charAt(0).toUpperCase() + String(key).slice(1)}`;
    setters[setterName] = (val: TValues[typeof key]) =>
      set({ [key]: val } as unknown as Partial<TStore>, undefined);
  }
  return setters as unknown as CreateSettersType<TValues, TPrefix>;
}
