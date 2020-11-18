import { initials } from './string';

// Tests
describe('initials', () => {
  it('should return initials', () => {
    expect(initials('Test test')).toEqual('TT');
  });

  it('should return nothing', () => {
    expect(initials('')).toEqual('');
  });
});
