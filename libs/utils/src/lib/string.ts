// Utils
export function initials(str: string): string {
  return str.split(' ').map(p => p[0]).join('').toUpperCase();
}
