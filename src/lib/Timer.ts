
/** 
 * @function
 * @description Асинхронная задержка
 * @param {number} n Время задержки в миллисекундах
 * @param {any} p Результат, который должен вернуться из Promise
 * */
export function delay<T = void>(n = 0, p?: T) {
  return new Promise<T>(resolve => setTimeout(resolve, n, p))
}