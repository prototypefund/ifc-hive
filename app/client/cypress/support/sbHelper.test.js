import sbHelper from './sbHelper';
import { describe, expect, it, vi } from 'vitest';

describe('getEnvVariable', function () {
    it('should return production', (ctx) => {

        window.configs['NODE_ENV'] = 'production'
        const result = getEnvVariable('NODE_ENV')
        expect(result).toBe('production')
    });
})