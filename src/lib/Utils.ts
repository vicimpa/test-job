class Fake { }
type Method = TypedPropertyDescriptor<(...args: any) => any>

/** @description Бинд контекста у методов класса */
export function bind() {
  return <T extends typeof Fake>(proto: T['prototype'], name: string, prop: Method) => {
    const { value } = prop
    return { get() { return value.bind(this) } }
  }
}