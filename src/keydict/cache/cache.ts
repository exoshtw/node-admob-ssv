
import {KeyObject} from 'crypto';
import RawKeyRegister from '../rawkeys';

export default interface KeyDictCache {
    get(id: number): Promise<KeyObject | null>;
    has(id: number): Promise<boolean>;
    save(key: RawKeyRegister): Promise<void>;
}
