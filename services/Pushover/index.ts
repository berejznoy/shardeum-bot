import {Pushover} from "pushover-js";
import {getNodeInfo, startNode} from "../../api";

export default class PushService {
    private prevStatus: 'offline' | 'active' | 'standby' | 'stopped'
    private pushover: Pushover

    constructor(pushover: Pushover) {
        this.prevStatus = 'offline'
        this.pushover = pushover
    }

    private async sendNotification(message: string) {
        this.pushover
            .setSound('pushover')
        try {
            await this.pushover.send('Shardeum', message)
        } catch (error) {
            console.error(error.message)
        }
    }

    private healthCheck = async (): Promise<void> => {
        try {
            const {state} = await getNodeInfo()
            if (state !== this.prevStatus) {
                await this.sendNotification(`Status: ${state}${state === 'stopped' ? '. Trying to restart' : ''}`)
                this.prevStatus = state
            }
            if(state === 'stopped') {
                await startNode()
            }
        } catch (error) {
            if (this.prevStatus !== 'offline' && error.response?.status !== 400) {
                await this.sendNotification('Status: not working')
                this.prevStatus = 'offline'
            }
        }
    }
    start() {
        setInterval(this.healthCheck, Number(process.env.INTERVAL) || 5000 * 60)
    }
}