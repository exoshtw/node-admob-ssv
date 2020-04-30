
import querystring from 'querystring';
import {createVerify} from 'crypto';
import debugLib from 'debug';
import {KeyDictCache} from './keydict/cache/cache';
import KeyProvider, {KeyProviderInterface} from './keydict/provider';

const debug = debugLib('admob-ssv:verifier');

/**
 * Usable message object
 *
 * @typedef {object} ParsedMessage
 * @property {number} keyId Key Id
 * @property {Buffer} signature Signagure
 * @property {Buffer} body Union qs attributes as buffer
 */
export interface ParsedMessage {
    keyId: number;
    signature: Buffer;
    body: Buffer;
}

/**
 * Verifier options
 *
 * @typedef {object} VerifierOptions
 * @property {KeyProviderInterface} keyProvider Key provider, by default create new
 * @property {KeyDictCache} keyCache If keyProvider is not defined, use custom KeyDictCache
 */
export interface VerifierOptions {
    keyProvider?: KeyProviderInterface;    
    keyCache?: KeyDictCache;
}

/**
 * Parse querystring to object
 *
 * @param {string} raw String of querystring
 * @returns {object} key, value dictionary from querystring
 */
export function parseQueryString(raw: string): object {
    debug(`Parsing query string`);
    return querystring.parse(raw);
}

/**
 * Parse params object to parsed message
 *
 * @param {object} data Raw key: value dicto
 * @returns {ParsedMessage} Usable message
 */
export function parseMessage(data: object): ParsedMessage {
    debug(`Parsing message`);
    // eslint-disable-next-line @typescript-eslint/camelcase
    const {key_id, signature} = data;
    const fdata = {...data};
    delete fdata.key_id;
    delete fdata.signature;
    // Sort atttributes
    const qs = querystring.stringify(fdata)
        .split('&')
        .sort()
        .join('&')
    ;

    return {
        keyId: parseInt(key_id, 10),
        signature: Buffer.from(signature, 'base64'),
        body: Buffer.from(qs, 'utf8')
    }
}

/**
 * Verifier class
 */
export default class Verifier {

    private keyProvider: KeyProviderInterface;

    /**
     * Create new verifier
     *
     * @param {VerifierOptions} [options] Verifier options
     */
    constructor(options? = {}): void {
        this.keyProvider = options.keyProvider || new KeyProvider({
            cache: options.keyCache || null,
        });
    }

    /**
     * Verify data
     *
     * @param {ParsedMessage|object|string} data Raw Data
     * @returns {Promise<boolean>} True if is verified
     */
    async verify(data: ParsedMessage | object | string): Promise<boolean> {
        debug(`Verify`);

        if (typeof data === 'string') {
            data = parseMessage(parseQueryString(data));
        } else if (!data.body) {
            data = parseMessage(data);
        }

        const {keyId, signature, body} = data;

        debug(`\tGetting key ${keyId}`);

        const key = await this.keyProvider.get(keyId);

        if (!key) {
            throw new Error('Key not found');
        }

        const verifier = createVerify('RSA-SHA256');
        verifier.update(body);

        debug(`\tVerifying`);
        return verifier.verify(
            key,
            signature,
        );
    }
}
