import ipaddr from 'ipaddr.js';

// Utils
export function ip2int(ip: string): number {
  const arr = ipaddr.parse(ip).toByteArray();
  return arr.reduce((acc, part) => ((acc << 8) + part), 0);
}