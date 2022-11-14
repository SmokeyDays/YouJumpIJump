
/**
 * 返回给定范围 [lbound, ubound] 内的随机整数。
 * @param lbound 范围下界
 * @param ubound 范围上界
 */
export function randInt(lbound: number, ubound: number) {
  return lbound + Math.floor(Math.random() * (ubound - lbound + 1));
}

/**
 * 随机打乱数组。
 * @param array 要打乱的数组
 */
export function shuffleArray<T>(array: T[]) {
  for (let i = 1; i < array.length; i++) {
    let target = Math.floor(Math.random() * (i + 1));
    if (target !== i) {
      [array[target], array[i]] = [array[i], array[target]];
    }
  }
}
