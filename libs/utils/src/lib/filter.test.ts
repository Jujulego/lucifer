import { toPredicate, filter, Filter } from './filter';

// Types
interface Obj {
  name: string,
  count: number,
  tags: string[]
}

// Tested list
const list: Obj[] = [
  { name: "banana", count: 5,  tags: ["fruit",  "yellow"] },
  { name: "dice",   count: 2,  tags: ["object", "white"]  },
  { name: "duck",   count: 5,  tags: ["animal", "yellow"] },
  { name: "berry",  count: 15, tags: ["fruit",  "blue"]   },
];

// Tests
test('empty filter', () => {
  const f: Filter<Obj> = {};

  // Predicate
  const predicate = toPredicate<Obj>(f);
  expect(predicate(list[0])).toBeTruthy();

  // On list
  const result = filter(list, f);
  expect(result).toEqual(list);
});

test('value filter', () => {
  const f: Filter<Obj> = { name: "dice" };

  // Predicate
  const predicate = toPredicate<Obj>(f);
  expect(predicate(list[0])).toBeFalsy();
  expect(predicate(list[1])).toBeTruthy();

  // On list
  const result = filter(list, f);
  expect(result).toHaveLength(1);
  expect(result).toContainEqual(list[1]);
});

test('array filter', () => {
  const f: Filter<Obj> = { count: [2, 15] };

  // Predicate
  const predicate = toPredicate<Obj>(f);
  expect(predicate(list[0])).toBeFalsy();
  expect(predicate(list[1])).toBeTruthy();

  // On list
  const result = filter(list, f);
  expect(result).toHaveLength(2);
  expect(result).toContainEqual(list[1]);
  expect(result).toContainEqual(list[3]);
});

test('tag filter (string)', () => {
  const f: Filter<Obj> = { tags: "fruit" };

  // Predicate
  const predicate = toPredicate<Obj>(f);
  expect(predicate(list[0])).toBeTruthy();
  expect(predicate(list[1])).toBeFalsy();

  // On list
  const result = filter(list, f);
  expect(result).toHaveLength(2);
  expect(result).toContainEqual(list[0]);
  expect(result).toContainEqual(list[3]);
});

test('tag filter (array)', () => {
  const f: Filter<Obj> = { tags: ["yellow", "fruit"] };

  // Predicate
  const predicate = toPredicate<Obj>(f);
  expect(predicate(list[0])).toBeTruthy();
  expect(predicate(list[1])).toBeFalsy();

  // On list
  const result = filter(list, f);
  expect(result).toHaveLength(1);
  expect(result).toContainEqual(list[0]);
});
