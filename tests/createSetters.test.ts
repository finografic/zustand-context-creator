import { describe, expect, it, vi } from 'vitest';
import { createStore } from 'zustand';
import { createSetters } from '../src/utils/zustand-setters';

describe('createSetters', () => {
  describe('basic functionality', () => {
    it('should create setters for all properties in defaultValue', () => {
      interface TestValues {
        name: string
        age: number
        active: boolean
      }

      const defaultValue: TestValues = {
        name: 'John',
        age: 30,
        active: true,
      };

      const store = createStore<TestValues>()(() => defaultValue);

      const setters = createSetters({
        set: store.setState as any,
        defaultValue,
      });

      expect(setters).toHaveProperty('setName');
      expect(setters).toHaveProperty('setAge');
      expect(setters).toHaveProperty('setActive');
      expect(typeof setters.setName).toBe('function');
      expect(typeof setters.setAge).toBe('function');
      expect(typeof setters.setActive).toBe('function');
    });

    it('should call set with correct state updates', () => {
      interface TestValues {
        name: string
        count: number
      }

      const defaultValue: TestValues = {
        name: 'Initial',
        count: 0,
      };

      const store = createStore<TestValues>()(() => defaultValue);
      const setSpy = vi.spyOn(store, 'setState');

      const setters = createSetters({
        set: store.setState as any,
        defaultValue,
      });

      setters.setName('Updated');
      expect(setSpy).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Updated' }),
        undefined,
      );

      setters.setCount(42);
      expect(setSpy).toHaveBeenCalledWith(
        expect.objectContaining({ count: 42 }),
        undefined,
      );
    });

    it('should preserve other state properties when updating', () => {
      interface TestValues {
        name: string
        age: number
      }

      const defaultValue: TestValues = {
        name: 'John',
        age: 30,
      };

      const store = createStore<TestValues>()(() => defaultValue);
      const setSpy = vi.spyOn(store, 'setState');

      const setters = createSetters({
        set: store.setState as any,
        defaultValue,
      });

      setters.setName('Jane');

      expect(setSpy).toHaveBeenCalledWith(
        expect.any(Function),
        undefined,
      );

      // Call the function to verify it preserves state
      const updateFn = setSpy.mock.calls[0][0] as (state: TestValues) => Partial<TestValues>;
      const currentState = { name: 'John', age: 30 };
      const result = updateFn(currentState);

      expect(result).toEqual({ name: 'Jane' });
    });
  });

  describe('with prefix', () => {
    it('should create setters with prefix', () => {
      interface TestValues {
        theme: string
        language: string
      }

      const defaultValue: TestValues = {
        theme: 'light',
        language: 'en',
      };

      const store = createStore<TestValues>()(() => defaultValue);

      const setters = createSetters({
        set: store.setState as any,
        defaultValue,
        prefix: 'AppConfig',
      });

      expect(setters).toHaveProperty('setAppConfigTheme');
      expect(setters).toHaveProperty('setAppConfigLanguage');
      expect(setters).not.toHaveProperty('setTheme');
      expect(setters).not.toHaveProperty('setLanguage');
    });

    it('should work with empty prefix', () => {
      interface TestValues {
        value: string
      }

      const defaultValue: TestValues = {
        value: 'test',
      };

      const store = createStore<TestValues>()(() => defaultValue);

      const setters = createSetters({
        set: store.setState as any,
        defaultValue,
        prefix: '',
      });

      expect(setters).toHaveProperty('setValue');
    });
  });

  describe('capitalization', () => {
    it('should capitalize first letter of property name', () => {
      interface TestValues {
        userName: string
        userEmail: string
      }

      const defaultValue: TestValues = {
        userName: 'john',
        userEmail: 'john@example.com',
      };

      const store = createStore<TestValues>()(() => defaultValue);

      const setters = createSetters({
        set: store.setState as any,
        defaultValue,
      });

      expect(setters).toHaveProperty('setUserName');
      expect(setters).toHaveProperty('setUserEmail');
    });

    it('should handle single character property names', () => {
      interface TestValues {
        x: number
        y: number
      }

      const defaultValue: TestValues = {
        x: 0,
        y: 0,
      };

      const store = createStore<TestValues>()(() => defaultValue);

      const setters = createSetters({
        set: store.setState as any,
        defaultValue,
      });

      expect(setters).toHaveProperty('setX');
      expect(setters).toHaveProperty('setY');
    });
  });

  describe('type safety', () => {
    it('should maintain type safety for setter parameters', () => {
      interface TestValues {
        count: number
        name: string
        active: boolean
      }

      const defaultValue: TestValues = {
        count: 0,
        name: '',
        active: false,
      };

      const store = createStore<TestValues>()(() => defaultValue);

      const setters = createSetters({
        set: store.setState as any,
        defaultValue,
      });

      // TypeScript should enforce these types at compile time
      // These tests verify runtime behavior
      expect(() => setters.setCount(42)).not.toThrow();
      expect(() => setters.setName('test')).not.toThrow();
      expect(() => setters.setActive(true)).not.toThrow();
    });
  });

  describe('edge cases', () => {
    it('should handle empty defaultValue object', () => {
      const defaultValue = {};
      const store = createStore<Record<string, never>>()(() => ({}));

      const setters = createSetters({
        set: store.setState as any,
        defaultValue,
      });

      expect(Object.keys(setters)).toHaveLength(0);
    });

    it('should handle nested object values', () => {
      interface NestedValue {
        user: {
          name: string
          age: number
        }
      }

      const defaultValue: NestedValue = {
        user: {
          name: 'John',
          age: 30,
        },
      };

      const store = createStore<NestedValue>()(() => defaultValue);

      const setters = createSetters({
        set: store.setState as any,
        defaultValue,
      });

      expect(setters).toHaveProperty('setUser');
      expect(typeof setters.setUser).toBe('function');

      const newUser = { name: 'Jane', age: 25 };
      setters.setUser(newUser);

      expect(store.getState().user).toEqual(newUser);
    });

    it('should handle array values', () => {
      interface ArrayValue {
        items: string[]
      }

      const defaultValue: ArrayValue = {
        items: ['a', 'b'],
      };

      const store = createStore<ArrayValue>()(() => defaultValue);

      const setters = createSetters({
        set: store.setState as any,
        defaultValue,
      });

      expect(setters).toHaveProperty('setItems');
      expect(typeof setters.setItems).toBe('function');

      const newItems = ['c', 'd', 'e'];
      setters.setItems(newItems);

      expect(store.getState().items).toEqual(newItems);
    });
  });
});
