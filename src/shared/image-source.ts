import { baseUrl } from './base-url.ts';

export function imageSource(path: string): string {
  return /^(?:https?:)?\/\//.test(path) ? path : `${baseUrl}/${path.replace(/^\//, '')}`;
}
