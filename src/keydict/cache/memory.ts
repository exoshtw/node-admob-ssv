
import {KeyObject, createPublicKey} from 'crypto';
import debugLib from 'debug';
import KeyDictCache from './cache';
import RawKeyRegister from '../rawkeys';

const debug = debugLib('admob-ssv:keydict:MemoryCache');

interface InternalKeyRegister extends RawKeyRegister {
    added: Number,
}

/**
 * In Memory Key cache
 */
export default class MemoryCache implements KeyDictCache {

    private keys: Map<Number, InternalKeyRegister>;

    constructor(keys?: Array<RawKeyRegister>) {
        this.keys = new Map();
        if (keys) {
            const now = Date.now();
            for (const key of keys) {
                this.keys.set(key.keyId, {
                    ...key,
                    added: now,
                });
            }
        }
    }

    has(id: Number): boolean {
        return this.keys.has(id);
    }

    get(id: Number): KeyObject {
        debug(`Get key ${id}`);
        const key = this.keys.get(id);
        return key ? createPublicKey(key.pem) : null;
    }

    save(key: RawKeyRegister): void {
        debug(`Set key ${key.keyId}`);
        const now = Date.now();
        this.keys.set(key.keyId, {
            ...key,
            added: now,
        });
    }
}
