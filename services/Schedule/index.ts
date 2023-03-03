import NodeCache from 'node-cache';
import {getNodeInfo, ResponseNodeInfo} from "../../api";

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
            this.error = null
            const cachedData = this.cache.get('cachedData');

            if (cachedData) {
                this.cache.del('cachedData')
            }
            this.cache.set('cachedData', responseData);
        } catch (error) {
            console.error(error);
            this.error = error
        }
    }
    public get cacheData(): ResponseNodeInfo['data'] | undefined {
        return this.cache.get('cachedData')
    }
    public get cacheError() {
        return this.error
    }

}
export default Scheduler