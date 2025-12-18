
import {KeyObject} from 'crypto';
import KeyDictCache from './cache/cache';
import MemoryCache from './cache/memory';
import KeyFetcher from './fetcher/fetcher';
import Fetcher from './fetcher';

export interface KeyProviderOptions {
    cache?: KeyDictCache;
    fetcher?: KeyFetcher;
}

export interface KeyProviderInterface {
    get(keyId: number): Promise<KeyObject | null>;
}

export default class KeyProvider implements KeyProviderInterface {

    private cache: KeyDictCache;
    private fetcher: KeyFetcher;

    constructor(options: KeyProviderOptions = {}) {
        this.cache = options.cache || new MemoryCache();
        this.fetcher = options.fetcher || new Fetcher();
    }

    async get(keyId: number): Promise<KeyObject | null> {
        if (!await this.cache.has(keyId)) {
            const keys = await this.fetcher.fetch();
            for (const rawKey of keys) {
                await this.cache.save(rawKey);
            }
        }

        return await this.cache.get(keyId);
    }
}
