
import {KeyObject} from 'crypto';
import RawKeyRegister from '../rawkeys';

export default interface KeyDictCache {
    new(keys?: Array<RawKeyRegister>);
    get(id: number): KeyObject;
    has(id: number): boolean;
    save(key: RawKeyRegister): void;
}
