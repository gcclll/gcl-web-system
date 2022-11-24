export interface IncreaseNumberOptions {
  points?: number[];
  callback?: (val: number) => void;
  loading?: (val: boolean) => void
}

/**
 * 数字递增效果
 * @param {number} start 起始值
 * @param {number} end 结束值
 * @param {IncreaseNumberOptions} options 停顿的点位数值
 */
export function increaseNumberInterval(
  start: number,
  end: number,
  options: IncreaseNumberOptions = {},
): () => void {
  let timer: NodeJS.Timer;
  let delayTimer: NodeJS.Timer;
  const points = options.points ?? [];

  const pause = (val: number) => val < end && points.includes(val);

  const stop = () => {
    clearTimeout(delayTimer);
    clearInterval(timer);
  };

  const run = () => {
    timer = setInterval(() => {
      start++;
      options.callback?.(start);
      let loading = false
      if (pause(start)) {
        clearInterval(timer);
        delayTimer = setTimeout(run, 1000);
        loading = true
      } else if (start === end) {
        console.log('end....');
        loading = false
        stop();
      }
      options.loading?.(loading)
    }, 60);
  };

  run();

  return stop;
}
