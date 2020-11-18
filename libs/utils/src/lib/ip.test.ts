import { ip2int } from './ip';

// Test ip convert
test('ip2int', () => {
  expect(ip2int('1.2.3.4')).toEqual(0x01020304);
});
