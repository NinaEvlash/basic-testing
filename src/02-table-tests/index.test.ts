import { simpleCalculator, Action } from './index';

const testCases = [
  { a: 8, b: 2, action: Action.Add, expected: 10 },
  { a: 8, b: 2, action: Action.Subtract, expected: 6 },
  { a: 8, b: 2, action: Action.Multiply, expected: 16 },
  { a: 8, b: 2, action: Action.Divide, expected: 4 },
  { a: 8, b: 2, action: Action.Exponentiate, expected: 64 },
  { a: 8, b: 2, action: '%', expected: null },
  { a: '8', b: 2, action: Action.Add, expected: null },
  { a: 8, b: null, action: Action.Add, expected: null },
];

describe('simpleCalculator', () => {
  test.each(testCases)(
    `should return $expected for $a $action $b`,
    ({ a, b, action, expected }) => {
      const result = simpleCalculator({ a, b, action });
      expect(result).toBe(expected);
    },
  );
});
