export function removeFirst<T>(arr: T[], value: T): T[] {
  const newArray = [...arr];
  const index = newArray.indexOf(value);

  if (index > -1) {
    newArray.splice(index, 1);
  }

  return newArray;
}
