
import {KeyObject} from 'crypto';
import KeyDictCache from './cache/cache';
import MemoryCache from './cache/memory';
import KeyFetcher from './fetcher/fetcher';
import Fetcher from './fetcher';

export interface KeyProviderOptions {
    cache?: KeyDictCache,
    fetcher?: KeyFetcher,
}

export interface KeyProviderInterface {
    constructor(options?: KeyProviderOptions): void;
    get(keyId: Number): Promise<KeyObject>;
}

export default class KeyProvider implements KeyProviderInterface {

    private cache: KeyDictCache;
    private fetcher: KeyFetcher;

    constructor(options: KeyProviderOptions = {}) {
        this.cache = options.cache || new MemoryCache();
        this.fetcher = options.fetcher || new Fetcher();
    }

    async get(keyId: Number): Promise<KeyObject> {
        if (!this.cache.has(keyId)) {
            const keys = await this.fetcher.fetch();
            for (const rawKey of keys) {
                this.cache.save(rawKey);
            }
        }

        return this.cache.get(keyId);
    }
}
