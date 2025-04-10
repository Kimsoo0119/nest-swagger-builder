export function setClassName(cls: Function, name: string) {
  Object.defineProperty(cls, "name", { value: name });
}
