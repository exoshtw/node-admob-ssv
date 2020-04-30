
import {KeyObject} from 'crypto';
import MemoryCache from '../src/keydict/cache/memory';

const KEY = {
    keyId: 3335741209,
    pem: `-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE+nzvoGqvDeB9+SzE6igTl7TyK4JB\nbglwir9oTcQta8NuG26ZpZFxt+F2NDk7asTE6/2Yc8i1ATcGIqtuS5hv0Q==\n-----END PUBLIC KEY-----`,
    base64:'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE+nzvoGqvDeB9+SzE6igTl7TyK4JBbglwir9oTcQta8NuG26ZpZFxt+F2NDk7asTE6/2Yc8i1ATcGIqtuS5hv0Q==',
}

describe('preloadKeys', function() {
    test(`Must to preload keys`, async () => {
        const cache = new MemoryCache([KEY]);
        expect(await cache.has(3335741209)).toBeTruthy();
    });
});

describe('save/save', function() {
    
    test('Must to save and get key', async () => {
        const cache = new MemoryCache();
        expect(await cache.has(3335741209)).toBeFalsy();
        await cache.save(KEY);
        expect(await cache.has(3335741209)).toBeTruthy();
        const key = await cache.get(3335741209);
        expect(key).toBeInstanceOf(KeyObject);
    });

    test('Must to return null if key does not exists', async () => {
        const cache = new MemoryCache();
        const key = await cache.get(3335741209);
        expect(key).toBeNull();
    });

});


