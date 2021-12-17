export function unique<T>(arr: T[]): T[] {
  function onlyUnique(value: T, index: number, self: T[]) {
    return self.indexOf(value) === index;
  }

  // usage example:

  return arr.filter(onlyUnique);
}
