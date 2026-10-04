import {compare} from './core.mjs';

export function shouldReflect(entry, target) {
  return compare(entry.state.heightMap, target).status === 'match'
    && entry.saved.some(h => JSON.stringify(h) === JSON.stringify(entry.state.heightMap));
}
