type SetState<T> = (partial: Partial<T> | ((state: T) => Partial<T>), replace?: boolean) => void;

/**
 * Utility type that generates setter function types based on a values object type
 * @template TValues - The values object type
 * @template TPrefix - The prefix to use for setter names (defaults to empty string)
 * @returns Object type with setter functions for each property in TValues
 */
export type CreateSettersType<TValues extends Record<string, any>, TPrefix extends string = ''> = {
  [K in keyof TValues as `set${TPrefix}${Capitalize<string & K>}`]: (val: TValues[K]) => void;
};

/**
 * Creates typed setter functions for Zustand store properties
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
  defaultValue: TValues
  set: SetState<TStore>
  prefix?: TPrefix
}): CreateSettersType<TValues, TPrefix> {
  return Object.keys(defaultValues).reduce(
    (acc, key) => ({
      ...acc,
      [`set${prefix}${key.charAt(0).toUpperCase() + key.slice(1)}`]: (val: TValues[typeof key]) =>
        set(state => ({ ...state, [key]: val })),
    }),
    {},
  ) as CreateSettersType<TValues, TPrefix>;
}
