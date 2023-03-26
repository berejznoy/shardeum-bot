import NodeCache from 'node-cache';
import {getNodeInfo, getStakeInfo, ResponseNodeInfo} from "../../api";
import {AxiosError} from "axios";

class Scheduler {
    private cache: NodeCache;
    private interval: ReturnType<typeof setInterval> | null
    private error: Error | null

    constructor(private pollIntervalSeconds: number, private cacheTtlSeconds: number) {
        this.cache = new NodeCache({ stdTTL: cacheTtlSeconds });
        this.interval = null
        this.error = null
    }

    public start(): void {
        this.interval = setInterval(this.pollApiWithCache.bind(this), this.pollIntervalSeconds * 1000);
    }
    public stop(): void {
        if(this.interval)  clearInterval(this.interval);
    }

    private async pollApiWithCache(): Promise<void> {
        try {

            const responseData = await getNodeInfo()
            let stakeData = {nominee: process.env.WALLET_ADDRESS}
            let isAddressAlreadyUse = false
            if(process.env.WALLET_ADDRESS) {
                stakeData = await getStakeInfo()
                isAddressAlreadyUse = responseData?.nomineeAddress?.toLowerCase() !== stakeData.nominee?.toLowerCase()
            }

            this.error = null
            const cachedData = this.cache.get('cachedData');

            if (cachedData) {
                this.cache.del('cachedData')
            }
            this.cache.set('cachedData', {...responseData, isAddressAlreadyUse});
        } catch (error) {
            if ((error instanceof AxiosError && error.code === 'ETIMEDOUT') || error?.response?.status === 400) {
                console.log('Request timed out or HTTP 400 error, ignoring');
            } else {
                console.error(error);
                this.error = error
            }
        }
    }
    public get cacheData(): (ResponseNodeInfo['data']) | undefined {
        return this.cache.get('cachedData')
    }
    public get cacheError() {
        return this.error
    }

}
export default Scheduler