import { ip2int } from 'src/utils/ip';

// Test ip convert
test('ip2int', () => {
  expect(ip2int('1.2.3.4')).toEqual(0x01020304);
});
