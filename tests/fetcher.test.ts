
import Fetcher from '../src/keydict/fetcher';

describe('#fetch', function() {
    test(`Must to fetch keys`, async () => {
        const fetcher = new Fetcher();
        const res = await fetcher.fetch();
        expect(Array.isArray(res));
    });
});

