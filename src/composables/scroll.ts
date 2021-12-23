export const getPosition = (el: HTMLElement): number => el.scrollHeight - el.scrollTop - el.clientHeight;

export const isAtBottom = (el: HTMLElement): boolean => getPosition(el) <= 0;

export const scrollToPosition = (el: HTMLElement, position: number, smooth: boolean = true): void => {
  el.scrollTo({
    top: el.scrollHeight - el.clientHeight - position,
    behavior: smooth ? 'smooth' : 'auto',
  });
};

export const scrollIntoView = (el: HTMLElement, smooth: boolean = true): void =>
  el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
