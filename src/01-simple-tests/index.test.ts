import { simpleCalculator, Action } from './index';

describe('simpleCalculator tests', () => {
  test('should add two numbers', () => {
    const result = simpleCalculator({ a: 8, b: 2, action: Action.Add });
    expect(result).toBe(10);
  });

  test('should subtract two numbers', () => {
    const result = simpleCalculator({ a: 8, b: 2, action: Action.Subtract });
    expect(result).toBe(6);
  });

  test('should multiply two numbers', () => {
    const result = simpleCalculator({ a: 8, b: 2, action: Action.Multiply });
    expect(result).toBe(16);
  });

  test('should divide two numbers', () => {
    const result = simpleCalculator({ a: 8, b: 2, action: Action.Divide });
    expect(result).toBe(4);
  });

  test('should exponentiate two numbers', () => {
    const result = simpleCalculator({
      a: 8,
      b: 2,
      action: Action.Exponentiate,
    });
    expect(result).toBe(64);
  });

  test('should return null for invalid action', () => {
    const result = simpleCalculator({ a: 8, b: 2, action: '%' });
    expect(result).toBeNull;
  });

  test('should return null for invalid arguments', () => {
    const result1 = simpleCalculator({ a: '8', b: 2, action: Action.Add });
    const result2 = simpleCalculator({ a: 8, b: null, action: Action.Add });
    expect(result1).toBeNull();
    expect(result2).toBeNull();
  });
});
