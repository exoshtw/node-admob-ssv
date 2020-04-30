
import {KeyObject} from 'crypto';
import RawKeyRegister from '../rawkeys';

export default interface KeyDictCache {
    constructor(keys?: Array<RawKeyRegister>);
    get(id: Number): KeyObject;
    has(id: Number): boolean;
    save(key: RawKeyRegister): void;
}
