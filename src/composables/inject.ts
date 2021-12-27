import { inject as baseInject } from 'vue';

export const inject = <T>(key: string, defaultValue?: T): T => {
  const resolved = baseInject(key, defaultValue);
  if (!resolved) throw new Error(`could not resolve ${key}`);
  return resolved;
};
