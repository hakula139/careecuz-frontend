const second = 1000; // ms
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;
const week = day * 7;
const month = day * 30.5;
const year = day * 365;

const parseDatetime = (time: string) => (time.endsWith('Z') ? time : `${time.replace(' ', 'T')}Z`);

export const getRelativeTime = (time: string): string => {
  let elapsed = new Date(parseDatetime(time)).getTime() - Date.now();
  const postfix = elapsed <= 0 ? '前' : '后';
  elapsed = Math.abs(elapsed);

  if (elapsed < minute) return `${Math.round(elapsed / second)} 秒${postfix}`;
  if (elapsed < hour) return `${Math.round(elapsed / minute)} 分钟${postfix}`;
  if (elapsed < day) return `${Math.round(elapsed / hour)} 小时${postfix}`;
  if (elapsed < week) return `${Math.round(elapsed / day)} 天${postfix}`;
  if (elapsed < month) return `${Math.round(elapsed / week)} 周${postfix}`;
  if (elapsed < year) return `${Math.round(elapsed / month)} 个月${postfix}`;
  return `${Math.round(elapsed / year)} 年${postfix}`;
};
