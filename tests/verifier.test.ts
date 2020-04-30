
import Verifier, * as vfuncs from '../src/verifier';

const data = {
    "ad_network": "5450213213286189855",
    "ad_unit": "1809337431",
    "custom_data": "holiiis",
    "reward_amount": "1",
    "reward_item": "Reward",
    "timestamp": "1588193918052",
    "transaction_id": "1b996a03fb990f1d28d631ae69575520",
    "user_id": "1712485313",
    "signature": "MEUCIQDXN3qOshww7SsZIlNUJc5yX3VCtDol3XW0E8K3n5lDEAIgVXsy0GstN-AEU-7g38p2SYMnO6iKb-vf65L9JqaTBv0",
    "key_id": "3335741209"
};

describe('.parseMessage', function() {

    test('Must to return parsed data', () => {
        const res = vfuncs.parseMessage(data);
        expect(res.keyId).toBe(3335741209);
        expect(res.signature.toString('hex')).toBe(
            Buffer.from(data.signature, 'base64').toString('hex'),
        );
        expect(res.body.toString('utf8')).toBe(
            'ad_network=5450213213286189855&ad_unit=1809337431&custom_dat' +
            'a=holiiis&reward_amount=1&reward_item=Reward&timestamp=15881' +
            '93918052&transaction_id=1b996a03fb990f1d28d631ae69575520&use' +
            'r_id=1712485313'
        );
    });

});

describe('Verifier', function() {
    
    describe('#verify', function() {
        test('Musto to be ok with object data', async () => {
            const verifier = new Verifier();
            const res = await verifier.verify(data);
            expect(res).toBeTruthy();
        });

        test('Musto to be ok with parsed data', async () => {
            const verifier = new Verifier();
            const pdata = vfuncs.parseMessage(data);
            const res = await verifier.verify(pdata);
            expect(res).toBeTruthy();
        });

        test('Musto to be ok with raw querystring', async () => {
            const verifier = new Verifier();
            const qs = 'ad_network=5450213213286189855&ad_unit=1809337431' +
                       '&custom_data=holiiis&reward_amount=1&reward_item=R' +
                       'eward&timestamp=1588193918052&transaction_id=1b996' +
                       'a03fb990f1d28d631ae69575520&user_id=1712485313&sig' +
                       'nature=MEUCIQDXN3qOshww7SsZIlNUJc5yX3VCtDol3XW0E8K' +
                       '3n5lDEAIgVXsy0GstN-AEU-7g38p2SYMnO6iKb-vf65L9JqaTB' +
                       'v0&key_id=3335741209'
            ;
            const res = await verifier.verify(qs);
            expect(res).toBeTruthy();
        });

        test('Must to fail with invalid data', async () => {
            const idata = {...data};
            idata.custom_data = '123';
            const verifier = new Verifier();
            const res = await verifier.verify(idata);
            expect(res).toBeFalsy();
        });

        test('Must to fail with invalid signature', async () => {
            const idata = {...data};
            idata.signature = data.signature.replace('a', 'b');
            const verifier = new Verifier();
            const res = await verifier.verify(idata);
            expect(res).toBeFalsy();
        });

        test('Must to fail with invalid keyId', async () => {
            const idata = {...data};
            idata.key_id = '3214234242';
            const verifier = new Verifier();
            try {
                await verifier.verify(idata);
            } catch (e) {
                expect(e.message).toBe('Key not found');
                return;
            }

            throw new Error('Pass');
        });
    });

});
