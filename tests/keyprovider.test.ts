
import {KeyObject} from 'crypto';
import KeyProvider from '../src/keydict/provider';

describe('#get', function() {
    
    // @TODO fake response
    test(`Get keyId`, async () => {
        const provider = new KeyProvider();
        const key = await provider.get(3335741209);
        expect(key).toBeInstanceOf(KeyObject);
    });
    
});

