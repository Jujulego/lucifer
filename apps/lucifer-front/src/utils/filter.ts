// Types
type FilterValue<T> = T extends Array<infer P> ? P | T : T | Array<T>;

export type Filter<T> = { [K in keyof T]?: FilterValue<T[K]> };
export type Predicate<T> = (obj: T) => boolean;

// Utils
function test<T>(value: T, filter?: FilterValue<T>): boolean {
  if (!filter) return true;

  // value & filter are arrays: all filters must be in value
  if (Array.isArray(filter) && Array.isArray(value)) {
    return filter.every(v => value.indexOf(v) !== -1);
  }

  // filter is array: value must be in filter
  if (Array.isArray(filter)) {
    return filter.indexOf(value) !== -1;
  }

  // value is array: filter must be in value
  if (Array.isArray(value)) {
    return value.indexOf(filter) !== -1;
  }

  return value === filter;
}

export function toPredicate<T>(filter: Filter<T>): Predicate<T> {
  return (obj) => Object.keys(filter).every(field => test(obj[field as keyof T], filter[field as keyof T]));
}

export function filter<T>(array: T[], filter: Filter<T>): T[] {
  return array.filter(toPredicate(filter));
}
