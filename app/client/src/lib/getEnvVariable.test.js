import getEnvVariable from './getEnvVariable';
import { Window } from 'happy-dom';
import { describe, expect, it, vi } from 'vitest';

vi.stubGlobal('window', new Window())
window.configs = {}
describe('getEnvVariable', function () {
  it('should return production', (ctx) => {

    window.configs['NODE_ENV'] = 'production'
    const result = getEnvVariable('NODE_ENV')
    expect(result).toBe('production')
  });
})
