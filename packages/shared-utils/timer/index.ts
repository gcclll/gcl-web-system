/**
 * 延迟执行函数，并返回清理函数
 */
export function delay(fn: () => void, timeout: number): () => void {
  let timer: NodeJS.Timer;

  timer = setTimeout(fn, timeout);

  return () => clearTimeout(timer);
}
