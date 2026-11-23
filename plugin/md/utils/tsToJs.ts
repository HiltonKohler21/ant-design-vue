import { transformSync } from '@babel/core';
import LRUCache from 'lru-cache';

const tsPlugin = require.resolve('@babel/plugin-transform-typescript');
const cache = new LRUCache<string, string>({ max: 1024 });

const tsToJs = async (content: string): Promise<string> => {
  if (!content) {
    return '';
  }
  const cached = cache.get(content);
  if (cached !== undefined) {
    return cached;
  }
  const { code } = transformSync(content, {
    configFile: false,
    babelrc: false,
    plugins: [
      [
        tsPlugin,
        {
          isTSX: false,
        },
      ],
    ],
  });
  const result = code ? code.trim() : '';
  cache.set(content, result);
  return result;
};

export default tsToJs;
