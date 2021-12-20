export function unique<T>(
  arr: T[],
  hash: (v: T) => string = JSON.stringify,
): T[] {
  const hashes: string[] = [];

  function onlyUnique(value: T, index: number, self: T[]) {
    const v = hash(value);
    if (hashes.includes(v)) {
      return false;
    } else {
      hashes.push(v);
      return true;
    }
  }

  // usage example:

  return arr.filter(onlyUnique);
}
