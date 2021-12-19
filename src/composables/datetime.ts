const second = 1000; // ms
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;
const week = day * 7;

export const getRelativeTime = (time: string): string => {
  const datetime = new Date(time);
  let elapsed = datetime.getTime() - Date.now();
  const postfix = elapsed <= 0 ? '前' : '后';
  elapsed = Math.abs(elapsed);

  if (elapsed < minute) return `${Math.round(elapsed / second)} 秒${postfix}`;
  if (elapsed < hour) return `${Math.round(elapsed / minute)} 分钟${postfix}`;
  if (elapsed < day) return `${Math.round(elapsed / hour)} 小时${postfix}`;
  if (elapsed < week) return `${Math.round(elapsed / day)} 天${postfix}`;
  return datetime.toISOString().split('T')[0];
};
