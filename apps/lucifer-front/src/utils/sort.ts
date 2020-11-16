// Types
export type FieldGetter<T> = ((obj: T) => any);
export type OrderByField<T> = (T extends Record<string, unknown> ? keyof T : any) | FieldGetter<T>;

export type Comparator<T> = (a: T, b: T) => number;

// Functions
function toGetter<T>(field: OrderByField<T>): FieldGetter<T> {
  if (typeof field === 'function') return field;
  return (obj: T) => obj[field];
}

export function asc<T>(a: T, b: T, orderBy: OrderByField<T>) {
  const getter = toGetter(orderBy);
  const va = getter(a);
  const vb = getter(b);

  // String case
  if (typeof va === 'string' && typeof vb === 'string') {
    return va.localeCompare(vb);
  }

  // Global case
  if (vb > va) return -1;
  if (vb < va) return 1;
  return 0;
}

export function desc<T>(a: T, b: T, orderBy: OrderByField<T>) {
  const getter = toGetter(orderBy);
  const va = getter(a);
  const vb = getter(b);

  // String case
  if (typeof va === 'string' && typeof vb === 'string') {
    return -va.localeCompare(vb);
  }

  // Global case
  if (vb < va) return -1;
  if (vb > va) return 1;
  return 0;
}

export function stableSort<T>(data: T[], cmp: Comparator<T>) {
  const stabilized = data.map((el, index) => [el, index] as [T, number]);

  stabilized.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  return stabilized.map(el => el[0]);
}
