
import {KeyObject} from 'crypto';

export interface RawKeyRegister {
    keyId: Number;
    pem: string;
    base64?: string;
}

export default interface KeyDictCache {
    constructor(keys?: Array<RawKeyRegister>);
    get(id: Number): KeyObject;
    has(id: Number): boolean;
    save(key: RawKeyRegister): void;
}
