
import RawKeyRegister from '../rawkeys';

export interface FetcherOptions {
    url?: string,
}

export default interface KeyFetcher {
    fetch(options?: FetcherOptions): Promise<RawKeyRegister[]>;
}
