
import https from 'https';
import KeyFetcher, {FetcherOptions} from './fetcher';
import RawKeyRegister from '../rawkeys';

const KEY_URL = 'https://www.gstatic.com/admob/reward/verifier-keys.json';

export default class SimpleFetcher implements KeyFetcher {

    async fetch(options: FetcherOptions = {}) {
        options = {
            url: KEY_URL,
            ...options,
        };

        return new Promise((resolve, reject) => {
            https.get(options.url, (response) => {
                let data: string = '';
                response.on('data', (chunk) => {
                    data += chunk;
                });

                response.once('end', () => {
                    try {
                        return resolve(JSON.parse(data).keys);
                    } catch (e) {
                        return reject(e);
                    }
                });
            })
                .on('error', (err) => {
                    return reject(err);
                });
        });

    }
}
