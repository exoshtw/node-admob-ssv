
import {KeyObject} from 'crypto';
import RawKeyRegister from '../rawkeys';

export default interface KeyDictCache {
    new(keys?: Array<RawKeyRegister>);
    get(id: number): Promise<KeyObject>;
    has(id: number): Promise<boolean>;
    save(key: RawKeyRegister): Promise<void>;
}
