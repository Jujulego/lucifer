import { asc, desc, stableSort } from './sort';

// Constants
const a = { num: 1, txt: 'a' };
const b = { num: 2, txt: 'b' };

// Test suite
describe('asc', () => {
  it('should return -1', () => {
    expect(asc(a, b, 'num')).toBe(-1);
  });

  it('should return -1 (with strings)', () => {
    expect(asc(a, b, 'txt')).toBe(-1);
  });

  it('should return 1', () => {
    expect(asc(b, a, 'num')).toBe(1);
  });

  it('should return 0', () => {
    expect(asc(a, a, 'num')).toBe(0);
  });
});

describe('desc', () => {
  it('should return 1', () => {
    expect(desc(a, b, 'num')).toBe(1);
  });

  it('should return 1 (with strings)', () => {
    expect(desc(a, b, 'txt')).toBe(1);
  });

  it('should return -1', () => {
    expect(desc(b, a, 'num')).toBe(-1);
  });

  it('should return 0', () => {
    expect(desc(a, a, 'num')).toBe(0);
  });
});

describe('stableSort', () => {
  it('should sort array in asc order', () => {
    expect(stableSort([a, a, b], (a, b) => asc(a, b, 'num'))).toEqual([a, a, b]);
  });

  it('should sort array in desc order', () => {
    expect(stableSort([a, a, b], (a, b) => desc(a, b, 'num'))).toEqual([b, a, a]);
  });
});
